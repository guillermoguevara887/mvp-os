import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await context.params
    const { tech_stack, reset_sprints } = await req.json()

    if (!Array.isArray(tech_stack)) {
      return NextResponse.json({ error: "tech_stack debe ser un array" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verificar que el proyecto pertenece al usuario
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
    }

    // Obtener el ai_request más reciente
    const { data: aiRequest, error: aiError } = await supabase
      .from("project_ai_requests")
      .select("id, respuesta")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (aiError || !aiRequest) {
      return NextResponse.json({ error: "No se encontró definición MVP" }, { status: 404 })
    }

    // Actualizar tech_stack en respuesta
    const updatedRespuesta = { ...(aiRequest.respuesta as object), tech_stack }

    const { error: updateError } = await supabase
      .from("project_ai_requests")
      .update({ respuesta: updatedRespuesta })
      .eq("id", aiRequest.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Borrar sprints si se solicitó reset
    if (reset_sprints) {
      const { data: sprints } = await supabase
        .from("project_sprints")
        .select("id")
        .eq("project_id", projectId)

      if (sprints?.length) {
        const sprintIds = sprints.map((s) => s.id)

        await supabase
          .from("project_sprint_tasks")
          .delete()
          .in("sprint_id", sprintIds)

        await supabase
          .from("project_sprints")
          .delete()
          .eq("project_id", projectId)

        await supabase
          .from("project_sprint_generations")
          .delete()
          .eq("project_id", projectId)
      }
    }

    return NextResponse.json({ success: true, tech_stack })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 })
  }
}
