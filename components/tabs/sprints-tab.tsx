"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Sparkles, Target, FileText, Pencil, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

/* ================= TYPES ================= */

interface Tarea {
  id: string
  titulo: string
  descripcion: string
  prioridad: "alta" | "media" | "baja"
  estado: "todo" | "in-progress" | "done"
  tipo: "feature" | "ai" | "setup" | "bug" | "urgent"
  tags?: string[]
  explicacion?: string
}

interface Sprint {
  id: string
  nombre: string
  objetivo: string
  resumen: string
  tareas: Tarea[]
}

/* ================= COLORS ================= */

const colorEstado = {
  "todo": "bg-red-400",
  "in-progress": "bg-blue-400",
  "done": "bg-green-400",
}

const colorPrioridad = {
  alta: "bg-red-100 text-red-700 border-red-200",
  media: "bg-amber-100 text-amber-700 border-amber-200",
  baja: "bg-green-100 text-green-700 border-green-200",
}

const labelPrioridad = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
}

const columnas = [
  { id: "todo", nombre: "Por Hacer", color: "bg-gray-400" },
  { id: "in-progress", nombre: "En Progreso", color: "bg-blue-500" },
  { id: "done", nombre: "Completado", color: "bg-green-500" },
] as const

/* ================= API TYPES ================= */

interface ApiTask {
  id: string
  title: string
  description: string | null
  task_type: string | null
  priority: "high" | "medium" | "low" | null
  acceptance_criteria: string | null
}

interface ApiSprint {
  id: string
  sprint_number: number
  goal: string
  summary: string
  tasks: ApiTask[]
}

/* ================= MAPPERS ================= */

function mapTipo(type: string): Tarea["tipo"] {
  switch (type) {
    case "ai":
      return "ai"
    case "qa":
      return "bug"
    case "deploy":
    case "db":
    case "auth":
      return "setup"
    default:
      return "feature"
  }
}

function mapBackendToUI(sprintsFromAPI: ApiSprint[]): Sprint[] {
  return sprintsFromAPI.map((sprint) => ({
    id: sprint.id,
    nombre: `Sprint ${sprint.sprint_number}`,
    objetivo: sprint.goal,
    resumen: sprint.summary,
    tareas: sprint.tasks.map((task: ApiTask) => ({
      id: task.id,
      titulo: task.title,
      descripcion: task.description || "",
      prioridad:
        task.priority === "high"
          ? "alta"
          : task.priority === "low"
            ? "baja"
            : "media",
      estado: "todo",
      tipo: mapTipo(task.task_type),
      explicacion: task.acceptance_criteria,
    })),
  }))
}

/* ================= COMPONENT ================= */

export function SprintsTab({ projectId }: { projectId: string }) {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [sprintActivo, setSprintActivo] = useState<Sprint | null>(null)
  const [generating, setGenerating] = useState(false)

  /* ===== GENERATE SPRINTS ===== */

  const handleGenerateSprints = async () => {
    try {
      setGenerating(true)

      const res = await fetch(
        `/api/projects/${projectId}/generate-sprints`,
        { method: "POST" }
      )

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      const mapped = mapBackendToUI(data.data.sprints)

      setSprints(mapped)
      setSprintActivo(mapped[0])
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  /* ===== DRAG ===== */

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const tareasPorEstado = (estado: Tarea["estado"]) =>
    sprintActivo?.tareas.filter((t) => t.estado === estado) || []

  /* ================= UI ================= */

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sprints</h2>

        <Button
          onClick={handleGenerateSprints}
          disabled={generating}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {generating ? "Generando..." : "Generar Sprints"}
        </Button>
      </div>

      {/* SPRINT SELECTOR */}
      <div className="px-6 pb-4 flex gap-2">
        {sprints.map((sprint) => (
          <button
            key={sprint.id}
            onClick={() => setSprintActivo(sprint)}
            className={cn(
              "rounded-full border px-4 py-1 text-sm",
              sprintActivo?.id === sprint.id
                ? "bg-black text-white"
                : "bg-muted"
            )}
          >
            {sprint.nombre}
          </button>
        ))}
      </div>

      {/* META */}
      {sprintActivo && (
        <div className="px-6 pb-4 flex gap-6 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Objetivo</p>
            <p>{sprintActivo.objetivo}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Resumen</p>
            <p>{sprintActivo.resumen}</p>
          </div>
        </div>
      )}

      {/* BOARD */}
      <DndContext sensors={sensors} collisionDetection={closestCorners}>
        <div className="flex gap-4 overflow-x-auto p-4">
          {columnas.map((col) => (
            <div key={col.id} className="w-80 shrink-0">
              <h3 className="mb-2 text-sm font-medium">
                {col.nombre} ({tareasPorEstado(col.id).length})
              </h3>

              <div className="space-y-2">
                {tareasPorEstado(col.id).map((t) => (
                  <Card key={t.id}>
                    <div className={cn("h-1", colorEstado[t.estado])} />
                    <CardContent className="p-3 space-y-2">
                      <p className="font-medium">{t.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.descripcion}
                      </p>

                      <Badge
                        variant="outline"
                        className={colorPrioridad[t.prioridad]}
                      >
                        {labelPrioridad[t.prioridad]}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  )
}