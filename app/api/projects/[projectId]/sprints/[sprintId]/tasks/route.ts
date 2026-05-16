import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  req: Request,
  context: { params: Promise<{ projectId: string; sprintId: string }> }
) {
  try {
    const { projectId, sprintId } = await context.params
    const { title, description, priority } = await req.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: "El título es requerido" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify project belongs to user
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    // Verify sprint belongs to project
    const { data: sprint, error: sprintError } = await supabase
      .from("project_sprints")
      .select("id")
      .eq("id", sprintId)
      .eq("project_id", projectId)
      .single()

    if (sprintError || !sprint) {
      return NextResponse.json({ error: "Sprint no encontrado" }, { status: 404 })
    }

    // Get current max order_index for this sprint
    const { data: lastTask } = await supabase
      .from("project_sprint_tasks")
      .select("order_index")
      .eq("sprint_id", sprintId)
      .order("order_index", { ascending: false })
      .limit(1)
      .maybeSingle()

    const orderIndex = (lastTask?.order_index ?? -1) + 1

    const { data: newTask, error: insertError } = await supabase
      .from("project_sprint_tasks")
      .insert({
        sprint_id: sprintId,
        project_id: projectId,
        title: title.trim(),
        description: description?.trim() || null,
        priority: priority ?? "medium",
        status: "todo",
        task_type: "feature",
        order_index: orderIndex,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ task: newTask }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}
