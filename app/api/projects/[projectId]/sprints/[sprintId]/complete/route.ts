import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createClient } from "@/lib/supabase/server"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const MODEL  = process.env.OPENAI_MODEL ?? "gpt-4o-mini"

export async function POST(
  _req: Request,
  context: { params: Promise<{ projectId: string; sprintId: string }> }
) {
  try {
    const { projectId, sprintId } = await context.params
    const supabase = await createClient()

    /* ── Auth ── */
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    /* ── Verify project ownership ── */
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    /* ── Verify sprint belongs to project ── */
    const { data: sprint, error: sprintError } = await supabase
      .from("project_sprints")
      .select("id, sprint_number, goal")
      .eq("id", sprintId)
      .eq("project_id", projectId)
      .single()

    if (sprintError || !sprint) {
      return NextResponse.json({ error: "Sprint no encontrado" }, { status: 404 })
    }

    /* ── Check not already completed ── */
    const { data: existing } = await supabase
      .from("project_completed_sprints")
      .select("id")
      .eq("sprint_id", sprintId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "Este sprint ya fue finalizado" }, { status: 409 })
    }

    /* ── Fetch tasks ── */
    const { data: tasks, error: tasksError } = await supabase
      .from("project_sprint_tasks")
      .select("id, title, description, status, task_type, priority")
      .eq("sprint_id", sprintId)
      .order("order_index")

    if (tasksError) {
      return NextResponse.json({ error: tasksError.message }, { status: 500 })
    }

    if (!tasks?.length) {
      return NextResponse.json({ error: "El sprint no tiene tareas" }, { status: 400 })
    }

    /* ── All tasks must be done ── */
    const allDone = tasks.every((t) => t.status === "done")
    if (!allDone) {
      return NextResponse.json(
        { error: "Todas las tareas deben estar completadas antes de finalizar el sprint" },
        { status: 400 }
      )
    }

    /* ── Build OpenAI prompt ── */
    const taskList = tasks
      .map((t, i) => `${i + 1}. ${t.title}${t.description ? ` — ${t.description}` : ""}`)
      .join("\n")

    const prompt = `Eres un asistente técnico. Resume el trabajo completado en este sprint de desarrollo de software.

Objetivo del sprint: ${sprint.goal ?? "No especificado"}

Tareas completadas:
${taskList}

Escribe un resumen conciso (3-5 párrafos) que incluya:
- Qué se logró en este sprint
- Funcionalidades implementadas
- Impacto en el producto

Responde en el mismo idioma en que están escritas las tareas. No uses listas, escribe en prosa.`

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    })

    const summary = completion.choices[0]?.message?.content?.trim() ?? ""

    /* ── Insert into project_completed_sprints ── */
    const { error: insertError } = await supabase
      .from("project_completed_sprints")
      .insert({
        project_id:     projectId,
        sprint_id:      sprintId,
        sprint_number:  sprint.sprint_number,
        summary,
        tasks_snapshot: tasks,
      })

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, summary, sprint_number: sprint.sprint_number })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}
