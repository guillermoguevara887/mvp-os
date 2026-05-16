"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ProjectWorkspace } from "@/components/project-workspace"
import { NewProjectDialog } from "@/components/new-project-dialog"
import { FolderKanban, Sparkles, ArrowRight, Menu } from "lucide-react"
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
  const [sidebarAbierto, setSidebarAbierto] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar
        proyectos={proyectos}
        proyectoActivo={proyectoActivo}
        onSeleccionarProyecto={setProyectoActivo}
        onNuevoProyecto={() => setDialogoAbierto(true)}
        open={sidebarAbierto}
        onClose={() => setSidebarAbierto(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        {/* Barra superior mobile: solo visible en pantallas pequeñas */}
        <div className="flex h-14 shrink-0 items-center border-b border-border px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11"
            onClick={() => setSidebarAbierto(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-2 flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <FolderKanban className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">MVPOS</span>
          </div>
        </div>

        {proyectoSeleccionado ? (
          <ProjectWorkspace
            proyecto={proyectoSeleccionado}
            onCerrar={() => setProyectoActivo(null)}
            onAbrirSidebar={() => setSidebarAbierto(true)}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <FolderKanban className="h-8 w-8 text-primary" />
            </div>

            <h2 className="text-balance text-center text-2xl font-semibold text-foreground">
              Bienvenido a MVPOS
            </h2>

            <p className="mt-2 max-w-md text-pretty text-center text-muted-foreground">
              Transforma tus ideas en planes de ejecución MVP estructurados.
              Selecciona un proyecto o crea uno nuevo para comenzar.
            </p>

            <Button
              className="mt-6 h-11 gap-2"
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