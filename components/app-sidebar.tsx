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
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 items-center border-b border-border px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <FolderKanban className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold text-foreground">MVPOS</span>
        </div>
      </div>

      <div className="p-3">
        <Button
          onClick={onNuevoProyecto}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      <div className="px-3 py-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Proyectos
        </span>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-1 py-1">
          {proyectos.map((proyecto) => (
            <button
              key={proyecto.id}
              onClick={() => onSeleccionarProyecto(proyecto.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent",
                proyectoActivo === proyecto.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
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
