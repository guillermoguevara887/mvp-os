import { buildPrompt } from "@/lib/ai/build-prompt"
import { generateMVP } from "@/lib/ai/generate-mvp"
import { safeParseJson } from "@/lib/ai/safe-parse-json"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export async function generarPlan(proyecto: {
  id: string
  nombre: string
  descripcion: string
  tipo: string
}) {
  // 1. crear prompt
  const prompt = buildPrompt(proyecto)

  // 2. llamar OpenAI
  const rawResponse = await generateMVP(prompt)

  if (!rawResponse) {
    console.error("No hubo respuesta")
    return null
  }

  // 3. parsear JSON
  const parsed = safeParseJson(rawResponse)

  if (!parsed) {
    console.error("Respuesta inválida")
    return null
  }

  // 4. guardar en DB
  const { error } = await supabase
    .from("project_ai_requests")
    .insert([
      {
        project_id: proyecto.id,
        prompt,
        respuesta: parsed,
      },
    ])

  if (error) {
    console.error(error.message)
    return null
  }

  return parsed
}