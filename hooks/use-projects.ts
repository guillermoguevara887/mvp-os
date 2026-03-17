"use client"

import { useState } from "react"
import type { Proyecto } from "@/types/project"
import { proyectosIniciales } from "@/lib/mock-projects"

export function useProjects() {

  const [proyectos, setProyectos] = useState<Proyecto[]>(proyectosIniciales)

  const [proyectoActivo, setProyectoActivo] = useState<string | null>(null)

  const crearProyecto = (datos: {
    nombre: string
    descripcion: string
    tipo?: string
  }) => {

    const nuevoProyecto: Proyecto = {
      id: Date.now().toString(),
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      estado: "activo",
      techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    }

    setProyectos((prev) => [nuevoProyecto, ...prev])

    setProyectoActivo(nuevoProyecto.id)
  }

  const proyectoSeleccionado =
    proyectos.find((p) => p.id === proyectoActivo)

  return {
    proyectos,
    proyectoActivo,
    proyectoSeleccionado,
    setProyectoActivo,
    crearProyecto,
  }

}