"use client"

import { Plus, FolderKanban, ChevronRight, LogOut, User, Settings, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

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
  usuario?: SupabaseUser | null
}

export function AppSidebar({
  proyectos,
  proyectoActivo,
  onSeleccionarProyecto,
  onNuevoProyecto,
  usuario,
}: AppSidebarProps) {
  const router = useRouter()
  const [cargandoLogout, setCargandoLogout] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    setCargandoLogout(true)
    await supabase.auth.signOut()
    router.push("/login")
  }

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

      {/* Seccion de Usuario con Dropdown */}
      <div className="border-t border-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-muted">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                {usuario?.user_metadata?.avatar_url ? (
                  <img
                    src={usuario.user_metadata.avatar_url}
                    alt="Avatar"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {usuario?.user_metadata?.full_name || usuario?.email?.split("@")[0] || "Usuario"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {usuario?.email || "sin email"}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem className="gap-2">
              <UserCircle className="h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Configuracion
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive focus:text-destructive"
              onClick={handleLogout}
              disabled={cargandoLogout}
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
