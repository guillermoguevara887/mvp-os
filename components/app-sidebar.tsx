"use client"

import { Plus, FolderKanban, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface Proyecto {
  id: string
  nombre: string
  estado: "activo" | "pausado" | "completado"
}

interface AppSidebarProps {
  proyectos: Proyecto[]
  proyectoActivo: string | null
  onSeleccionarProyecto: (id: string) => void
  onNuevoProyecto: () => void
}

export function AppSidebar({
  proyectos,
  proyectoActivo,
  onSeleccionarProyecto,
  onNuevoProyecto,
}: AppSidebarProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FolderKanban className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold text-foreground">MVPOS</span>
        </div>
      </div>

      {/* Nuevo Proyecto */}
      <div className="px-3 pb-2">
        <Button
          onClick={onNuevoProyecto}
          className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Lista de Proyectos */}
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
              onClick={() => onSeleccionarProyecto(proyecto.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all",
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
    </aside>
  )
}
