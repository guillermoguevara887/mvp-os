"use client"

import { useState, useRef, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sparkles, Pencil, Trash2, GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
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

const colorBarra = {
  "todo": "bg-red-400",
  "in-progress": "bg-blue-400",
  "done": "bg-green-400",
}

const colorPrioridad = {
  alta: "bg-red-100 text-red-700 border-red-200",
  media: "bg-amber-100 text-amber-700 border-amber-200",
  baja: "bg-green-100 text-green-700 border-green-200",
}

const labelPrioridad = { alta: "Alta", media: "Media", baja: "Baja" }

const columnas = [
  { id: "todo",       nombre: "Por Hacer",  color: "bg-gray-400" },
  { id: "in-progress", nombre: "En Progreso", color: "bg-blue-500" },
  { id: "done",       nombre: "Completado", color: "bg-green-500" },
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
  goal: string | null
  summary: string | null
  tasks: ApiTask[]
}

/* ================= MAPPERS ================= */

function mapTipo(type: string | null): Tarea["tipo"] {
  switch (type) {
    case "ai":     return "ai"
    case "qa":     return "bug"
    case "deploy":
    case "db":
    case "auth":   return "setup"
    default:       return "feature"
  }
}

function mapBackendToUI(sprintsFromAPI: ApiSprint[]): Sprint[] {
  return sprintsFromAPI.map((sprint) => ({
    id: sprint.id,
    nombre: `Sprint ${sprint.sprint_number}`,
    objetivo: sprint.goal ?? "",
    resumen: sprint.summary ?? "",
    tareas: sprint.tasks.map((task) => ({
      id: task.id,
      titulo: task.title,
      descripcion: task.description ?? "",
      prioridad: task.priority === "high" ? "alta" : task.priority === "low" ? "baja" : "media",
      estado: "todo" as const,
      tipo: mapTipo(task.task_type),
      explicacion: task.acceptance_criteria ?? undefined,
    })),
  }))
}

/* ================= TAREA CARD ================= */

function TareaCard({
  tarea,
  onEdit,
  onDelete,
  ghost = false,
}: {
  tarea: Tarea
  onEdit: (t: Tarea) => void
  onDelete: (id: string) => void
  ghost?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tarea.id, data: { tarea } })

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={cn(
          "group relative border-border bg-card transition-shadow hover:shadow-md",
          (isDragging || ghost) && "opacity-40 shadow-lg"
        )}
      >
        <div className={cn("h-1 rounded-t-[calc(var(--radius)-1px)]", colorBarra[tarea.estado])} />
        <CardContent className="p-3">
          <div className="flex items-start gap-2">

            {/* Drag handle — único punto de arrastre */}
            <button
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              className="mt-0.5 cursor-grab touch-none text-muted-foreground/30 opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
              title="Mover"
            >
              <GripVertical className="h-4 w-4" />
            </button>

            {/* Contenido */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug">{tarea.titulo}</p>
              {tarea.descripcion && (
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {tarea.descripcion}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={cn("text-xs", colorPrioridad[tarea.prioridad])}>
                  {labelPrioridad[tarea.prioridad]}
                </Badge>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={() => onEdit(tarea)}
                className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Editar"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(tarea.id)}
                className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Eliminar"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ================= COLUMNA ================= */

function Columna({
  col,
  tareas,
  onEdit,
  onDelete,
}: {
  col: typeof columnas[number]
  tareas: Tarea[]
  onEdit: (t: Tarea) => void
  onDelete: (id: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-xl bg-muted/40 p-3 transition-colors",
        isOver && "bg-primary/5 ring-2 ring-primary/25"
      )}
    >
      {/* Header columna */}
      <div className="mb-3 flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", col.color)} />
        <span className="text-sm font-medium">{col.nombre}</span>
        <span className="ml-auto rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
          {tareas.length}
        </span>
      </div>

      {/* Tareas */}
      <SortableContext items={tareas.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex min-h-[60px] flex-col gap-2">
          {tareas.map((t) => (
            <TareaCard key={t.id} tarea={t} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

/* ================= LOADING ================= */

const LOADING_STEPS = [
  "Analizando la definición de tu MVP...",
  "Diseñando la estructura de sprints...",
  "Generando tareas y criterios de aceptación...",
  "Optimizando el plan de ejecución...",
  "Guardando en base de datos...",
]
const STEP_DELAYS = [0, 3000, 7000, 13000, 19000]

/* ================= MAIN COMPONENT ================= */

export function SprintsTab({ projectId }: { projectId: string }) {
  const [sprints, setSprints]             = useState<Sprint[]>([])
  const [sprintActivo, setSprintActivo]   = useState<Sprint | null>(null)
  const [generating, setGenerating]       = useState(false)
  const [loadingExisting, setLoadingExisting] = useState(true)
  const [error, setError]                 = useState<string | null>(null)
  const [loadingStep, setLoadingStep]     = useState(0)
  const [progress, setProgress]           = useState(0)
  const [activeId, setActiveId]           = useState<string | null>(null)
  const [tareaEditando, setTareaEditando] = useState<Tarea | null>(null)
  const [editForm, setEditForm]           = useState<Tarea | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  /* ===== CARGAR SPRINTS EXISTENTES ===== */

  useEffect(() => {
    async function loadExistingSprints() {
      setLoadingExisting(true)
      try {
        const supabase = createClient()

        const { data: sprintData, error: sprintError } = await supabase
          .from("project_sprints")
          .select("*")
          .eq("project_id", projectId)
          .order("order_index")

        if (sprintError || !sprintData?.length) return

        const sprintIds = sprintData.map((s) => s.id)

        const { data: taskData } = await supabase
          .from("project_sprint_tasks")
          .select("*")
          .in("sprint_id", sprintIds)
          .order("order_index")

        const tasksBySprint = new Map<string, typeof taskData>()
        taskData?.forEach((t) => {
          if (!tasksBySprint.has(t.sprint_id)) tasksBySprint.set(t.sprint_id, [])
          tasksBySprint.get(t.sprint_id)!.push(t)
        })

        const mapped: Sprint[] = sprintData.map((s) => ({
          id: s.id,
          nombre: `Sprint ${s.sprint_number}`,
          objetivo: s.goal ?? "",
          resumen: s.summary ?? "",
          tareas: (tasksBySprint.get(s.id) ?? []).map((t) => ({
            id: t.id,
            titulo: t.title,
            descripcion: t.description ?? "",
            prioridad: t.priority === "high" ? "alta" : t.priority === "low" ? "baja" : "media",
            estado: (["in-progress", "done"].includes(t.status) ? t.status : "todo") as Tarea["estado"],
            tipo: mapTipo(t.task_type),
            explicacion: t.acceptance_criteria ?? undefined,
          })),
        }))

        setSprints(mapped)
        setSprintActivo(mapped[0] ?? null)
      } finally {
        setLoadingExisting(false)
      }
    }

    loadExistingSprints()
  }, [projectId])

  /* ===== HELPERS ===== */

  const updateTareasEnSprint = (fn: (tareas: Tarea[]) => Tarea[]) => {
    if (!sprintActivo) return
    setSprints((prev) =>
      prev.map((s) => s.id === sprintActivo.id ? { ...s, tareas: fn(s.tareas) } : s)
    )
    setSprintActivo((prev) => prev ? { ...prev, tareas: fn(prev.tareas) } : null)
  }

  /* ===== LOADING ===== */

  const startLoadingSimulation = () => {
    setLoadingStep(0)
    setProgress(0)
    const stepProgress = [0, 20, 45, 70, 88]
    STEP_DELAYS.forEach((delay, i) => {
      const t = setTimeout(() => { setLoadingStep(i); setProgress(stepProgress[i]) }, delay)
      timersRef.current.push(t)
    })
  }

  const stopLoadingSimulation = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setProgress(100)
  }

  /* ===== GENERATE SPRINTS ===== */

  const handleGenerateSprints = async () => {
    try {
      setGenerating(true)
      setError(null)
      startLoadingSimulation()

      const res  = await fetch(`/api/projects/${projectId}/generate-sprints`, { method: "POST" })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Error al generar sprints")

      stopLoadingSimulation()
      const mapped = mapBackendToUI(data.data.sprints)
      setSprints(mapped)
      setSprintActivo(mapped[0] ?? null)
    } catch (err) {
      console.error(err)
      stopLoadingSimulation()
      setError(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setTimeout(() => setGenerating(false), 400)
    }
  }

  /* ===== DRAG & DROP ===== */

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || !sprintActivo) return

    const tareaId  = active.id as string
    const overId   = over.id  as string

    let targetEstado: Tarea["estado"] | null = null

    if (columnas.some((c) => c.id === overId)) {
      targetEstado = overId as Tarea["estado"]
    } else {
      const overTarea = sprintActivo.tareas.find((t) => t.id === overId)
      if (overTarea) targetEstado = overTarea.estado
    }

    if (!targetEstado) return

    updateTareasEnSprint((tareas) =>
      tareas.map((t) => t.id === tareaId ? { ...t, estado: targetEstado! } : t)
    )
  }

  /* ===== EDIT ===== */

  const handleOpenEdit = (t: Tarea) => {
    setTareaEditando(t)
    setEditForm({ ...t })
  }

  const handleSaveEdit = () => {
    if (!editForm) return
    updateTareasEnSprint((tareas) => tareas.map((t) => t.id === editForm.id ? editForm : t))
    setTareaEditando(null)
    setEditForm(null)
  }

  /* ===== DELETE ===== */

  const handleDelete = (tareaId: string) => {
    updateTareasEnSprint((tareas) => tareas.filter((t) => t.id !== tareaId))
  }

  /* ===== COMPUTED ===== */

  const tareasPorEstado = (estado: Tarea["estado"]) =>
    sprintActivo?.tareas.filter((t) => t.estado === estado) ?? []

  const tareaActiva = activeId
    ? sprintActivo?.tareas.find((t) => t.id === activeId) ?? null
    : null

  /* ================= RENDER ================= */

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-lg font-semibold">Sprints</h2>
        <Button
          onClick={handleGenerateSprints}
          disabled={generating || loadingExisting || sprints.length > 0}
          title={sprints.length > 0 ? "Ya existen sprints para este proyecto" : ""}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {generating ? "Generando..." : sprints.length > 0 ? "Sprints generados" : "Generar Sprints"}
        </Button>
      </div>

      {/* CARGA INICIAL */}
      {loadingExisting && !generating && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary" />
            <p className="text-sm">Cargando sprints...</p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {error && !loadingExisting && (
        <div className="mx-6 mb-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* LOADING SCREEN */}
      {generating && (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-8">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 animate-pulse text-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-base font-medium text-foreground">{LOADING_STEPS[loadingStep]}</p>
            <p className="mt-1 text-sm text-muted-foreground">Esto puede tardar unos segundos</p>
          </div>
          <div className="w-full max-w-sm">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Progreso</span><span>{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-700 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-2">
            {LOADING_STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-all duration-300",
                  i < loadingStep  ? "border-primary bg-primary text-primary-foreground"
                  : i === loadingStep ? "animate-pulse border-primary text-primary"
                  : "border-muted-foreground/30 text-muted-foreground/30"
                )}>
                  {i < loadingStep ? "✓" : i + 1}
                </div>
                <span className={cn(
                  "transition-colors duration-300",
                  i <= loadingStep ? "text-foreground" : "text-muted-foreground/40"
                )}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOARD */}
      {!generating && !loadingExisting && (
        <>
          {/* Sprint selector */}
          <div className="flex gap-2 px-6 pb-4">
            {sprints.map((sprint) => (
              <button
                key={sprint.id}
                onClick={() => setSprintActivo(sprint)}
                className={cn(
                  "rounded-full border px-4 py-1 text-sm transition-colors",
                  sprintActivo?.id === sprint.id ? "bg-foreground text-background" : "bg-muted hover:bg-muted/80"
                )}
              >
                {sprint.nombre}
              </button>
            ))}
          </div>

          {/* Meta */}
          {sprintActivo && (
            <div className="flex gap-6 px-6 pb-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Objetivo</p>
                <p>{sprintActivo.objetivo}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Resumen</p>
                <p>{sprintActivo.resumen}</p>
              </div>
            </div>
          )}

          {/* Kanban */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 overflow-x-auto p-4">
              {columnas.map((col) => (
                <Columna
                  key={col.id}
                  col={col}
                  tareas={tareasPorEstado(col.id)}
                  onEdit={handleOpenEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* Ghost mientras se arrastra */}
            <DragOverlay>
              {tareaActiva && (
                <TareaCard
                  tarea={tareaActiva}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  ghost
                />
              )}
            </DragOverlay>
          </DndContext>
        </>
      )}

      {/* EDIT DIALOG */}
      <Dialog open={!!tareaEditando} onOpenChange={(open) => { if (!open) { setTareaEditando(null); setEditForm(null) } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar tarea</DialogTitle>
          </DialogHeader>

          {editForm && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <Label>Título</Label>
                <Input
                  value={editForm.titulo}
                  onChange={(e) => setEditForm({ ...editForm, titulo: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Descripción</Label>
                <Textarea
                  value={editForm.descripcion}
                  rows={3}
                  onChange={(e) => setEditForm({ ...editForm, descripcion: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label>Prioridad</Label>
                  <Select
                    value={editForm.prioridad}
                    onValueChange={(v) => setEditForm({ ...editForm, prioridad: v as Tarea["prioridad"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Estado</Label>
                  <Select
                    value={editForm.estado}
                    onValueChange={(v) => setEditForm({ ...editForm, estado: v as Tarea["estado"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Por Hacer</SelectItem>
                      <SelectItem value="in-progress">En Progreso</SelectItem>
                      <SelectItem value="done">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Criterios de aceptación</Label>
                <Textarea
                  value={editForm.explicacion ?? ""}
                  rows={2}
                  onChange={(e) => setEditForm({ ...editForm, explicacion: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => { setTareaEditando(null); setEditForm(null) }}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
