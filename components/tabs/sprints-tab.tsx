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
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Tarea {
  id: string
  titulo: string
  descripcion: string
  prioridad: "alta" | "media" | "baja"
  estado: "todo" | "in-progress" | "done"
  tipo: "feature" | "ai" | "setup" | "bug" | "urgent"
  tags?: string[]
  explicacion?: string
  pasos?: string[]
  promptAI?: string
  checklist?: { item: string; completado: boolean }[]
}

interface Sprint {
  id: string
  nombre: string
  objetivo: string
  resumen: string
  tareas: Tarea[]
}

const sprintsIniciales: Sprint[] = [
  {
    id: "sprint-1",
    nombre: "Sprint 1",
    objetivo: "Construir la base del proyecto",
    resumen: "Configurar Next.js, layout principal y CRUD de proyectos.",
    tareas: [
      {
        id: "t1",
        titulo: "Configurar proyecto Next.js",
        descripcion: "Inicializar el proyecto con TypeScript y Tailwind",
        prioridad: "alta",
        estado: "done",
        tipo: "setup",
        tags: ["Backend", "Config"],
        explicacion: "La base del proyecto es fundamental. Next.js con App Router proporciona la mejor experiencia de desarrollo y rendimiento.",
        pasos: [
          "Ejecutar npx create-next-app@latest",
          "Configurar TypeScript strict mode",
          "Instalar y configurar Tailwind CSS",
          "Configurar shadcn/ui",
        ],
        promptAI: "Crea un proyecto Next.js con TypeScript, Tailwind CSS y shadcn/ui configurado con el tema oscuro por defecto.",
        checklist: [
          { item: "Proyecto inicializado", completado: true },
          { item: "TypeScript configurado", completado: true },
          { item: "Tailwind CSS funcionando", completado: true },
          { item: "shadcn/ui instalado", completado: true },
        ],
      },
      {
        id: "t2",
        titulo: "Diseñar layout principal",
        descripcion: "Crear el layout con sidebar y área de contenido",
        prioridad: "alta",
        estado: "in-progress",
        tipo: "feature",
        tags: ["UI", "Frontend"],
        explicacion: "El layout define la estructura visual de toda la aplicación. Un diseño consistente mejora la UX.",
        pasos: [
          "Crear componente Sidebar",
          "Implementar navegación responsiva",
          "Configurar el sistema de rutas",
        ],
        promptAI: "Diseña un layout de dashboard moderno con sidebar izquierdo estilo Linear/Notion.",
        checklist: [
          { item: "Sidebar creado", completado: true },
          { item: "Layout responsivo", completado: false },
        ],
      },
      {
        id: "t3",
        titulo: "Implementar sistema de proyectos",
        descripcion: "CRUD básico para gestionar proyectos",
        prioridad: "media",
        estado: "todo",
        tipo: "feature",
        tags: ["Backend", "API"],
        explicacion: "Los proyectos son la entidad central de MVPOS. Necesitamos crear, leer y listar proyectos.",
        pasos: [
          "Definir modelo de datos del proyecto",
          "Crear API routes para CRUD",
          "Implementar estado local con React",
        ],
        promptAI: "Implementa un CRUD de proyectos con Next.js API routes y estado local.",
        checklist: [
          { item: "Modelo definido", completado: false },
          { item: "API funcionando", completado: false },
          { item: "UI integrada", completado: false },
        ],
      },
    ],
  },
  {
    id: "sprint-2",
    nombre: "Sprint 2",
    objetivo: "Crear interfaz de captura de proyectos",
    resumen: "Formulario de nuevo proyecto y tablero Kanban de tareas.",
    tareas: [
      {
        id: "t4",
        titulo: "Crear formulario de nuevo proyecto",
        descripcion: "Formulario para capturar ideas y generar MVP",
        prioridad: "alta",
        estado: "todo",
        tipo: "feature",
        tags: ["UI", "Forms"],
        explicacion: "El formulario es el punto de entrada principal para los usuarios. Debe ser intuitivo y guiar al usuario.",
        pasos: [
          "Diseñar campos del formulario",
          "Implementar validación",
          "Agregar panel de ayuda lateral",
        ],
        promptAI: "Crea un formulario de proyecto con campos para nombre, descripción, tipo y deadline.",
        checklist: [
          { item: "Formulario diseñado", completado: false },
          { item: "Validación implementada", completado: false },
        ],
      },
      {
        id: "t5",
        titulo: "Integrar AI para generación",
        descripcion: "Conectar con OpenAI para sugerencias automáticas",
        prioridad: "media",
        estado: "todo",
        tipo: "ai",
        tags: ["AI", "Backend"],
        explicacion: "El tablero Kanban permite visualizar el progreso del desarrollo de manera intuitiva.",
        pasos: [
          "Crear componente de columna",
          "Implementar tarjetas de tarea",
          "Agregar panel de detalles",
        ],
        promptAI: "Diseña un tablero Kanban con 3 columnas de sprint y tarjetas arrastrables.",
        checklist: [
          { item: "Columnas creadas", completado: false },
          { item: "Tarjetas implementadas", completado: false },
        ],
      },
    ],
  },
  {
    id: "sprint-3",
    nombre: "Sprint 3",
    objetivo: "Integración con AI y documentación",
    resumen: "Conectar con APIs de AI para generación automática de planes MVP.",
    tareas: [
      {
        id: "t6",
        titulo: "Bug crítico en autenticación",
        descripcion: "Los usuarios no pueden iniciar sesión con Google",
        prioridad: "alta",
        estado: "todo",
        tipo: "urgent",
        tags: ["Bug", "Auth"],
        explicacion: "La generación automática de planes MVP es el diferenciador clave del producto.",
        pasos: [
          "Configurar API de OpenAI/Anthropic",
          "Crear prompts estructurados",
          "Implementar streaming de respuestas",
        ],
        promptAI: "Integra AI SDK para generar planes MVP a partir de descripciones de ideas.",
        checklist: [
          { item: "API configurada", completado: false },
          { item: "Prompts creados", completado: false },
          { item: "UI con streaming", completado: false },
        ],
      },
      {
        id: "t7",
        titulo: "Agregar documentación",
        descripcion: "Sistema de docs con markdown",
        prioridad: "baja",
        estado: "todo",
        tipo: "feature",
        tags: ["Docs"],
        explicacion: "La documentación permite a los usuarios mantener notas y especificaciones del proyecto.",
        pasos: [
          "Instalar editor markdown",
          "Crear sistema de guardado",
          "Implementar preview en tiempo real",
        ],
        promptAI: "Agrega un editor markdown simple para documentación de proyectos.",
        checklist: [
          { item: "Editor instalado", completado: false },
          { item: "Preview funcionando", completado: false },
        ],
      },
    ],
  },
]

// Colores de header por tipo de tarea
const colorTipo = {
  feature: "bg-blue-500",
  ai: "bg-purple-500",
  setup: "bg-orange-500",
  bug: "bg-red-500",
  urgent: "bg-red-600",
}

const labelTipo = {
  feature: "Feature",
  ai: "AI",
  setup: "Setup",
  bug: "Bug",
  urgent: "Urgente",
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

// Componente de tarjeta arrastrable
function TareaCard({
  tarea,
  onClick,
  isDragging = false,
}: {
  tarea: Tarea
  onClick: () => void
  isDragging?: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tarea.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all duration-200",
        "hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/30",
        isDragging && "shadow-xl scale-105 opacity-90"
      )}
      onClick={onClick}
    >
      {/* Color header strip */}
      <div className={cn("h-1.5 w-full", colorTipo[tarea.tipo])} />
      
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium leading-snug text-foreground">
            {tarea.titulo}
          </h4>
          <div
            {...attributes}
            {...listeners}
            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {tarea.descripcion}
        </p>

        {/* Tags */}
        {tarea.tags && tarea.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {tarea.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn("text-[10px] font-medium", colorPrioridad[tarea.prioridad])}
          >
            {labelPrioridad[tarea.prioridad]}
          </Badge>
          <div className="flex items-center gap-1.5">
            {tarea.promptAI && (
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-100">
                <Sparkles className="h-3 w-3 text-purple-600" />
              </div>
            )}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Tarjeta de overlay para drag
function TareaOverlay({ tarea }: { tarea: Tarea }) {
  return (
    <Card className="overflow-hidden rounded-xl border border-primary/30 bg-card shadow-2xl">
      <div className={cn("h-1.5 w-full", colorTipo[tarea.tipo])} />
      <CardContent className="p-3.5">
        <h4 className="text-sm font-medium leading-snug text-foreground">
          {tarea.titulo}
        </h4>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {tarea.descripcion}
        </p>
      </CardContent>
    </Card>
  )
}

export function SprintsTab() {
  const [sprints, setSprints] = useState<Sprint[]>(sprintsIniciales)
  const [sprintActivo, setSprintActivo] = useState(sprints[0])
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null)
  const [dialogoCrear, setDialogoCrear] = useState<"todo" | "in-progress" | "done" | null>(null)
  const [dialogoEliminar, setDialogoEliminar] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [tareaDragging, setTareaDragging] = useState<Tarea | null>(null)

  // Form state para crear/editar
  const [formTarea, setFormTarea] = useState({
    titulo: "",
    descripcion: "",
    prioridad: "media" as Tarea["prioridad"],
    tipo: "feature" as Tarea["tipo"],
    tags: "",
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const tareasPorEstado = (estado: Tarea["estado"]) =>
    sprintActivo.tareas.filter((t) => t.estado === estado)

  const handleDragStart = (event: DragStartEvent) => {
    const tarea = sprintActivo.tareas.find((t) => t.id === event.active.id)
    if (tarea) setTareaDragging(tarea)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setTareaDragging(null)

    if (!over) return

    const tareaId = active.id as string
    const overColumn = over.id as string

    // Check if dropping on a column
    if (["todo", "in-progress", "done"].includes(overColumn)) {
      const nuevasTareas = sprintActivo.tareas.map((t) =>
        t.id === tareaId ? { ...t, estado: overColumn as Tarea["estado"] } : t
      )

      const nuevoSprint = { ...sprintActivo, tareas: nuevasTareas }
      setSprintActivo(nuevoSprint)
      setSprints((prev) =>
        prev.map((s) => (s.id === sprintActivo.id ? nuevoSprint : s))
      )
    }
  }

  const handleCrearTarea = () => {
    if (!dialogoCrear || !formTarea.titulo.trim()) return

    const nuevaTarea: Tarea = {
      id: `t-${Date.now()}`,
      titulo: formTarea.titulo,
      descripcion: formTarea.descripcion,
      prioridad: formTarea.prioridad,
      tipo: formTarea.tipo,
      estado: dialogoCrear,
      tags: formTarea.tags.split(",").map((t) => t.trim()).filter(Boolean),
    }

    const nuevoSprint = {
      ...sprintActivo,
      tareas: [...sprintActivo.tareas, nuevaTarea],
    }
    setSprintActivo(nuevoSprint)
    setSprints((prev) =>
      prev.map((s) => (s.id === sprintActivo.id ? nuevoSprint : s))
    )

    setDialogoCrear(null)
    setFormTarea({ titulo: "", descripcion: "", prioridad: "media", tipo: "feature", tags: "" })
  }

  const handleGuardarEdicion = () => {
    if (!tareaSeleccionada) return

    const tareaActualizada: Tarea = {
      ...tareaSeleccionada,
      titulo: formTarea.titulo,
      descripcion: formTarea.descripcion,
      prioridad: formTarea.prioridad,
      tipo: formTarea.tipo,
      tags: formTarea.tags.split(",").map((t) => t.trim()).filter(Boolean),
    }

    const nuevoSprint = {
      ...sprintActivo,
      tareas: sprintActivo.tareas.map((t) =>
        t.id === tareaSeleccionada.id ? tareaActualizada : t
      ),
    }
    setSprintActivo(nuevoSprint)
    setSprints((prev) =>
      prev.map((s) => (s.id === sprintActivo.id ? nuevoSprint : s))
    )

    setTareaSeleccionada(tareaActualizada)
    setModoEdicion(false)
  }

  const handleEliminarTarea = () => {
    if (!tareaSeleccionada) return

    const nuevoSprint = {
      ...sprintActivo,
      tareas: sprintActivo.tareas.filter((t) => t.id !== tareaSeleccionada.id),
    }
    setSprintActivo(nuevoSprint)
    setSprints((prev) =>
      prev.map((s) => (s.id === sprintActivo.id ? nuevoSprint : s))
    )

    setDialogoEliminar(false)
    setTareaSeleccionada(null)
  }

  const abrirEdicion = () => {
    if (!tareaSeleccionada) return
    setFormTarea({
      titulo: tareaSeleccionada.titulo,
      descripcion: tareaSeleccionada.descripcion,
      prioridad: tareaSeleccionada.prioridad,
      tipo: tareaSeleccionada.tipo,
      tags: tareaSeleccionada.tags?.join(", ") || "",
    })
    setModoEdicion(true)
  }

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Sprint Selector */}
        <div className="border-b border-border px-6 py-3">
          <div className="flex items-center gap-1">
            {sprints.map((sprint) => (
              <button
                key={sprint.id}
                onClick={() => setSprintActivo(sprint)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  sprintActivo.id === sprint.id
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                {sprint.nombre}
              </button>
            ))}
            <Button variant="ghost" size="sm" className="ml-2 h-8 gap-1.5 text-muted-foreground">
              <Plus className="h-3.5 w-3.5" />
              Agregar Sprint
            </Button>
          </div>
        </div>

        {/* Sprint Metadata */}
        <div className="border-b border-border bg-card/50 px-6 py-4">
          <div className="flex items-start gap-8">
            <div className="flex items-start gap-3">
              <Target className="mt-0.5 h-4 w-4 text-chart-1" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Objetivo
                </p>
                <p className="mt-0.5 text-sm text-foreground">{sprintActivo.objetivo}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-4 w-4 text-chart-2" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Resumen
                </p>
                <p className="mt-0.5 text-sm text-foreground">{sprintActivo.resumen}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
            <div className="flex h-full gap-4">
              {columnas.map((columna) => {
                const tareas = tareasPorEstado(columna.id)
                return (
                  <div
                    key={columna.id}
                    id={columna.id}
                    className="flex w-80 shrink-0 flex-col"
                  >
                    <div className="mb-3 flex shrink-0 items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", columna.color)} />
                        <h3 className="text-sm font-medium text-foreground">{columna.nombre}</h3>
                        <span className="text-xs text-muted-foreground">{tareas.length}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => {
                          setFormTarea({ titulo: "", descripcion: "", prioridad: "media", tipo: "feature", tags: "" })
                          setDialogoCrear(columna.id)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="flex-1">
                      <SortableContext
                        items={tareas.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div
                          className={cn(
                            "flex min-h-[200px] flex-col gap-2.5 rounded-lg p-1 pr-2 transition-colors",
                            tareaDragging && "bg-secondary/30"
                          )}
                          id={columna.id}
                        >
                          {tareas.map((tarea) => (
                            <TareaCard
                              key={tarea.id}
                              tarea={tarea}
                              onClick={() => setTareaSeleccionada(tarea)}
                            />
                          ))}
                          {tareas.length === 0 && !tareaDragging && (
                            <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border/60">
                              <p className="text-xs text-muted-foreground">Sin tareas</p>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </ScrollArea>
                  </div>
                )
              })}
            </div>
          </div>

          <DragOverlay>
            {tareaDragging ? <TareaOverlay tarea={tareaDragging} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={!!dialogoCrear} onOpenChange={() => setDialogoCrear(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva Tarea</DialogTitle>
            <DialogDescription>
              Agrega una nueva tarea a la columna seleccionada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="titulo">Titulo</Label>
              <Input
                id="titulo"
                value={formTarea.titulo}
                onChange={(e) => setFormTarea({ ...formTarea, titulo: e.target.value })}
                placeholder="Nombre de la tarea"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripcion</Label>
              <Textarea
                id="descripcion"
                value={formTarea.descripcion}
                onChange={(e) => setFormTarea({ ...formTarea, descripcion: e.target.value })}
                placeholder="Describe la tarea brevemente"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Prioridad</Label>
                <Select
                  value={formTarea.prioridad}
                  onValueChange={(v) => setFormTarea({ ...formTarea, prioridad: v as Tarea["prioridad"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tipo</Label>
                <Select
                  value={formTarea.tipo}
                  onValueChange={(v) => setFormTarea({ ...formTarea, tipo: v as Tarea["tipo"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="setup">Setup</SelectItem>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (separados por coma)</Label>
              <Input
                id="tags"
                value={formTarea.tags}
                onChange={(e) => setFormTarea({ ...formTarea, tags: e.target.value })}
                placeholder="Backend, API, UI"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoCrear(null)}>
              Cancelar
            </Button>
            <Button onClick={handleCrearTarea} disabled={!formTarea.titulo.trim()}>
              Crear Tarea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogoEliminar} onOpenChange={setDialogoEliminar}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Eliminar Tarea</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoEliminar(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminarTarea}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Detail Sheet */}
      <Sheet open={!!tareaSeleccionada} onOpenChange={() => { setTareaSeleccionada(null); setModoEdicion(false) }}>
        <SheetContent className="w-full border-border sm:max-w-lg">
          {tareaSeleccionada && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-3 w-3 rounded-full", colorTipo[tareaSeleccionada.tipo])} />
                    <span className="text-xs font-medium text-muted-foreground">
                      {labelTipo[tareaSeleccionada.tipo]}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px]", colorPrioridad[tareaSeleccionada.prioridad])}
                    >
                      {labelPrioridad[tareaSeleccionada.prioridad]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={abrirEdicion}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDialogoEliminar(true)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {modoEdicion ? (
                  <div className="mt-2 space-y-3">
                    <Input
                      value={formTarea.titulo}
                      onChange={(e) => setFormTarea({ ...formTarea, titulo: e.target.value })}
                      className="text-lg font-semibold"
                    />
                    <Textarea
                      value={formTarea.descripcion}
                      onChange={(e) => setFormTarea({ ...formTarea, descripcion: e.target.value })}
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Select
                        value={formTarea.prioridad}
                        onValueChange={(v) => setFormTarea({ ...formTarea, prioridad: v as Tarea["prioridad"] })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={formTarea.tipo}
                        onValueChange={(v) => setFormTarea({ ...formTarea, tipo: v as Tarea["tipo"] })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feature">Feature</SelectItem>
                          <SelectItem value="ai">AI</SelectItem>
                          <SelectItem value="setup">Setup</SelectItem>
                          <SelectItem value="bug">Bug</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      value={formTarea.tags}
                      onChange={(e) => setFormTarea({ ...formTarea, tags: e.target.value })}
                      placeholder="Tags separados por coma"
                    />
                    <Button onClick={handleGuardarEdicion} className="w-full">
                      Guardar Cambios
                    </Button>
                  </div>
                ) : (
                  <>
                    <SheetTitle className="text-lg">{tareaSeleccionada.titulo}</SheetTitle>
                    <SheetDescription>{tareaSeleccionada.descripcion}</SheetDescription>
                  </>
                )}
              </SheetHeader>

              {!modoEdicion && (
                <div className="mt-6 space-y-6">
                  {tareaSeleccionada.tags && tareaSeleccionada.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tareaSeleccionada.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {tareaSeleccionada.explicacion && (
                    <div>
                      <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Por qué es importante
                      </h4>
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {tareaSeleccionada.explicacion}
                      </p>
                    </div>
                  )}

                  {tareaSeleccionada.pasos && (
                    <div>
                      <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Pasos de implementación
                      </h4>
                      <ol className="list-inside list-decimal space-y-1.5 text-sm text-foreground/90">
                        {tareaSeleccionada.pasos.map((paso, index) => (
                          <li key={index} className="leading-relaxed">{paso}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {tareaSeleccionada.promptAI && (
                    <div>
                      <h4 className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                        Prompt sugerido para AI
                      </h4>
                      <div className="rounded-lg border border-purple-200 bg-purple-50 p-3.5">
                        <p className="text-sm leading-relaxed text-foreground/90">
                          {tareaSeleccionada.promptAI}
                        </p>
                      </div>
                    </div>
                  )}

                  {tareaSeleccionada.checklist && (
                    <div>
                      <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Checklist de aceptación
                      </h4>
                      <div className="space-y-2">
                        {tareaSeleccionada.checklist.map((item, index) => (
                          <div key={index} className="flex items-center gap-2.5">
                            <Checkbox id={`check-${index}`} defaultChecked={item.completado} />
                            <label
                              htmlFor={`check-${index}`}
                              className="text-sm text-foreground/90"
                            >
                              {item.item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
