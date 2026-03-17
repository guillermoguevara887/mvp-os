"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ProjectWorkspace } from "@/components/project-workspace"
import { NewProjectDialog } from "@/components/new-project-dialog"
import { FolderKanban, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/use-projects"

export default function HomePage() {
  const {
    proyectos,
    proyectoActivo,
    proyectoSeleccionado,
    setProyectoActivo,
    crearProyecto,
  } = useProjects()

  const [dialogoAbierto, setDialogoAbierto] = useState(false)

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
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <FolderKanban className="h-8 w-8 text-primary" />
            </div>

            <h2 className="text-2xl font-semibold text-center text-foreground text-balance">
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
        onCrear={crearProyecto}
      />
    </div>
  )
}