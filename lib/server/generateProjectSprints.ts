import OpenAI from "openai"
import { safeParseJson } from "@/lib/ai/safe-parse-json"
import { buildSprintGenerationPrompt } from "@/lib/ai/build-sprint-prompt"
import {
  parseAndValidateSprintResponse,
  type SprintGenerationResponse,
} from "@/lib/ai/sprint-schemas"
import { createClient } from "@/lib/supabase/server"

type ProjectRow = {
  id: string
  nombre: string
  descripcion: string | null
  tipo: string | null
  user_id: string
}

type ProjectAiRequestRow = {
  id: string
  project_id: string
  prompt: string
  respuesta: unknown
  created_at: string
}

type GenerateProjectSprintsParams = {
  projectId: string
  userId: string
}

type GenerateProjectSprintsResult = {
  generationId: string
  projectId: string
  sprints: any[]
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini"

/* ================= DB HELPERS ================= */

async function getProjectById(projectId: string, userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    throw new Error("Project not found or access denied")
  }

  return data as ProjectRow
}

async function getLatestProjectAiRequest(projectId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("project_ai_requests")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(error.message)
  if (!data) throw new Error("No MVP definition found")

  return data as ProjectAiRequestRow
}

/* ================= OPENAI ================= */

async function callOpenAi(prompt: string): Promise<string> {
  const response = await openai.responses.create({
    model: OPENAI_MODEL,
    input: prompt,
  })

  const text = response.output_text

  if (!text) throw new Error("Empty AI response")

  return text
}

/* ================= MAIN ================= */

export async function generateProjectSprints({
  projectId,
  userId,
}: GenerateProjectSprintsParams): Promise<GenerateProjectSprintsResult> {
  if (!projectId) throw new Error("projectId required")
  if (!userId) throw new Error("userId required")

  const project = await getProjectById(projectId, userId)
  const mvp = await getLatestProjectAiRequest(projectId)

  const prompt = buildSprintGenerationPrompt({
    projectName: project.nombre,
    projectDescription: project.descripcion ?? "",
    projectType: project.tipo ?? undefined,
    mvpDefinition: mvp.respuesta,
  })

  /* ================= AI ================= */

  const rawResponse = await callOpenAi(prompt)

  console.log("🔥 RAW AI RESPONSE:")
  console.log(rawResponse)

  /* ================= PARSE ================= */

  const parsed = safeParseJson(rawResponse)
  const validated = parseAndValidateSprintResponse(parsed)

  /* ================= DB ================= */

  const supabase = await createClient()

  const { data: generation, error: genError } = await supabase
    .from("project_sprint_generations")
    .insert({
      project_id: projectId,
      source_ai_request_id: mvp.id,
      prompt,
      response: validated,
      model: OPENAI_MODEL,
      status: "completed",
    })
    .select("id")
    .single()

  if (genError || !generation) {
    throw new Error("Failed to save generation")
  }

  const sprintRows = validated.sprints.map((s, index) => ({
    project_id: projectId,
    generation_id: generation.id,
    sprint_number: s.sprint_number,
    title: s.title,
    goal: s.goal,
    summary: s.summary,
    estimated_days: s.estimated_days,
    status: "planned",
    order_index: index,
  }))

  const { data: insertedSprints, error: sprintError } = await supabase
    .from("project_sprints")
    .insert(sprintRows)
    .select("*")

  if (sprintError || !insertedSprints) {
    throw new Error("Failed to insert sprints")
  }

  const sprintMap = new Map<number, string>()
  insertedSprints.forEach((s) => sprintMap.set(s.sprint_number, s.id))

  const tasks = validated.sprints.flatMap((s) =>
    s.tasks.map((t, i) => ({
      sprint_id: sprintMap.get(s.sprint_number),
      project_id: projectId,
      title: t.title,
      description: t.description,
      task_type: t.task_type,
      priority: t.priority,
      status: "todo",
      estimated_hours: t.estimated_hours,
      acceptance_criteria: t.acceptance_criteria,
      order_index: i,
    }))
  )

  const { data: insertedTasks } = await supabase
    .from("project_sprint_tasks")
    .insert(tasks)
    .select("*")

  const tasksBySprint = new Map<string, any[]>()

  insertedTasks?.forEach((t) => {
    if (!tasksBySprint.has(t.sprint_id)) {
      tasksBySprint.set(t.sprint_id, [])
    }
    tasksBySprint.get(t.sprint_id)!.push(t)
  })

  const finalSprints = insertedSprints.map((s) => ({
    ...s,
    tasks: tasksBySprint.get(s.id) || [],
  }))

  return {
    generationId: generation.id,
    projectId,
    sprints: finalSprints,
  }
}