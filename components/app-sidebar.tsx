"use client"

import { Plus, FolderKanban, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/user-menu"
import type { Proyecto } from "@/types/project"

interface AppSidebarProps {
  proyectos: Proyecto[]
  proyectoActivo: string | null
  onSeleccionarProyecto: (id: string) => void
  onNuevoProyecto: () => void
  open?: boolean
  onClose?: () => void
}

export function AppSidebar({
  proyectos,
  proyectoActivo,
  onSeleccionarProyecto,
  onNuevoProyecto,
  open = false,
  onClose,
}: AppSidebarProps) {
  const handleSelectProject = (id: string) => {
    onSeleccionarProyecto(id)
    onClose?.()
  }

  const handleNewProject = () => {
    onNuevoProyecto()
    onClose?.()
  }

  return (
    <>
      {/* Overlay — solo en mobile cuando el drawer está abierto */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          // Base: drawer móvil (fixed, fuera de pantalla por defecto)
          "fixed inset-y-0 left-0 z-30 flex h-full w-72 shrink-0 flex-col border-r border-border bg-card transition-transform duration-300",
          // En mobile: entra/sale con translate
          open ? "translate-x-0" : "-translate-x-full",
          // En desktop: siempre visible, posición estática
          "md:static md:w-60 md:translate-x-0"
        )}
      >
        {/* Header del sidebar */}
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FolderKanban className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold text-foreground">MVPOS</span>
          </div>
          {/* Botón cerrar — solo visible en mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={onClose}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nuevo Proyecto */}
        <div className="px-3 pb-2">
          <Button
            onClick={handleNewProject}
            className="h-11 w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>

        {/* Label lista */}
        <div className="px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Proyectos
          </span>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="flex flex-col gap-0.5">
            {proyectos.map((proyecto) => (
              <button
                key={proyecto.id}
                onClick={() => handleSelectProject(proyecto.id)}
                className={cn(
                  "flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
                  proyectoActivo === proyecto.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                <span className="truncate">{proyecto.nombre}</span>
                {proyectoActivo === proyecto.id && (
                  <ChevronRight className="h-4 w-4 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>

        <UserMenu />
      </aside>
    </>
  )
}
