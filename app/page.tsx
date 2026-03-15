"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ProjectWorkspace } from "@/components/project-workspace"
import { NewProjectDialog } from "@/components/new-project-dialog"
import { FolderKanban, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Proyecto {
  id: string
  nombre: string
  descripcion: string
  estado: "activo" | "pausado" | "completado"
  problema?: string
  alcanceMvp?: string
  arquitectura?: string
  techStack?: string[]
}

const proyectosIniciales: Proyecto[] = [
  {
    id: "1",
    nombre: "MVPOS",
    descripcion: "Sistema de gestión de proyectos MVP para desarrolladores y founders",
    estado: "activo",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL"],
  },
  {
    id: "2",
    nombre: "ChatBot AI",
    descripcion: "Asistente virtual inteligente para atención al cliente",
    estado: "activo",
    techStack: ["Python", "FastAPI", "OpenAI", "Redis"],
  },
  {
    id: "3",
    nombre: "Marketplace Local",
    descripcion: "Plataforma de comercio electrónico para negocios locales",
    estado: "pausado",
    techStack: ["Next.js", "Stripe", "Supabase", "Tailwind CSS"],
  },
]

export default function HomePage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>(proyectosIniciales)
  const [proyectoActivo, setProyectoActivo] = useState<string | null>(null)
  const [dialogoAbierto, setDialogoAbierto] = useState(false)

  const proyectoSeleccionado = proyectos.find((p) => p.id === proyectoActivo)

  const handleNuevoProyecto = (datos: {
    nombre: string
    descripcion: string
    tipo: string
  }) => {
    const nuevoProyecto: Proyecto = {
      id: Date.now().toString(),
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      estado: "activo",
      techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    }
    setProyectos([nuevoProyecto, ...proyectos])
    setProyectoActivo(nuevoProyecto.id)
  }

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar
        proyectos={proyectos}
        proyectoActivo={proyectoActivo}
        onSeleccionarProyecto={setProyectoActivo}
        onNuevoProyecto={() => setDialogoAbierto(true)}
      />

      <main className="flex-1 overflow-y-auto">
        {proyectoSeleccionado ? (
          <ProjectWorkspace
            proyecto={proyectoSeleccionado}
            onCerrar={() => setProyectoActivo(null)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
              <FolderKanban className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground text-balance text-center">
              Bienvenido a MVPOS
            </h2>
            <p className="mt-2 max-w-md text-center text-muted-foreground text-pretty">
              Transforma tus ideas en planes de ejecución MVP estructurados.
              Selecciona un proyecto o crea uno nuevo para comenzar.
            </p>
            <Button
              className="mt-6 gap-2"
              onClick={() => setDialogoAbierto(true)}
            >
              <Sparkles className="h-4 w-4" />
              Crear Nuevo Proyecto
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>

      <NewProjectDialog
        open={dialogoAbierto}
        onOpenChange={setDialogoAbierto}
        onCrear={handleNuevoProyecto}
      />
    </div>
  )
}
