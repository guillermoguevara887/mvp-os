"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Proyecto } from "@/types/project"
import { generarPlan } from "@/lib/ai/generate-plan"

export function useProjects() {
  const supabase = createClient()

  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [proyectoActivo, setProyectoActivo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 🔥 CARGAR PROYECTOS
  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error(error.message)
        return
      }

      setProyectos(data || [])
      setLoading(false)
    }

    fetchProjects()
  }, [])

  // 🔥 CREAR PROYECTO + IA
  const crearProyecto = async (datos: {
    nombre: string
    descripcion: string
    tipo: string
  }) => {
    const { data: userData } = await supabase.auth.getUser()
    const user = userData.user

    if (!user) {
      console.error("No hay usuario")
      return
    }

    // 1️⃣ Crear proyecto
    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          tipo: datos.tipo,
          user_id: user.id,
        },
      ])
      .select()
      .single()

    if (error || !data) {
      console.error(error?.message)
      return
    }

    // 2️⃣ Actualizar UI inmediatamente (UX fluido)
    setProyectos((prev) => [data, ...prev])
    setProyectoActivo(data.id)

    // 3️⃣ Generar plan AI (en background)
    try {
      await generarPlan(data)
    } catch (err) {
      console.error("Error generando plan AI:", err)
    }
  }

  const proyectoSeleccionado = proyectos.find(
    (p) => p.id === proyectoActivo
  )

  return {
    proyectos,
    proyectoActivo,
    proyectoSeleccionado,
    setProyectoActivo,
    crearProyecto,
    loading,
  }
}