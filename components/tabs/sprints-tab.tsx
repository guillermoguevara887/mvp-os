"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Sparkles, Target, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface Tarea {
  id: string
  titulo: string
  descripcion: string
  prioridad: "alta" | "media" | "baja"
  estado: "todo" | "in-progress" | "done"
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
        titulo: "Diseñar tablero Kanban",
        descripcion: "Vista de sprints con columnas y tarjetas",
        prioridad: "media",
        estado: "todo",
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
        titulo: "Integrar generación AI",
        descripcion: "Conectar con API de AI para generar planes MVP",
        prioridad: "alta",
        estado: "todo",
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

const colorPrioridad = {
  alta: "bg-destructive/15 text-destructive-foreground border-destructive/30",
  media: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  baja: "bg-chart-2/15 text-chart-2 border-chart-2/30",
}

const labelPrioridad = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
}

const columnas = [
  { id: "todo", nombre: "Por Hacer", color: "bg-muted-foreground/20" },
  { id: "in-progress", nombre: "En Progreso", color: "bg-chart-1/30" },
  { id: "done", nombre: "Completado", color: "bg-chart-2/30" },
] as const

export function SprintsTab() {
  const [sprintActivo, setSprintActivo] = useState(sprintsIniciales[0])
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null)

  const tareasPorEstado = (estado: Tarea["estado"]) =>
    sprintActivo.tareas.filter((t) => t.estado === estado)

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Sprint Selector */}
        <div className="border-b border-border px-6 py-3">
          <div className="flex items-center gap-1">
            {sprintsIniciales.map((sprint) => (
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
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <div className="flex h-full gap-4">
            {columnas.map((columna) => {
              const tareas = tareasPorEstado(columna.id)
              return (
                <div key={columna.id} className="flex w-72 shrink-0 flex-col">
                  <div className="mb-3 flex shrink-0 items-center gap-2">
                    <div className={cn("h-2 w-2 rounded-full", columna.color)} />
                    <h3 className="text-sm font-medium text-foreground">{columna.nombre}</h3>
                    <span className="text-xs text-muted-foreground">{tareas.length}</span>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="flex flex-col gap-2.5 pr-2">
                      {tareas.map((tarea) => (
                        <Card
                          key={tarea.id}
                          className="cursor-pointer border-border/60 bg-card transition-all hover:border-border hover:bg-accent/50"
                          onClick={() => setTareaSeleccionada(tarea)}
                        >
                          <CardContent className="p-3.5">
                            <h4 className="text-sm font-medium leading-snug text-foreground">
                              {tarea.titulo}
                            </h4>
                            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {tarea.descripcion}
                            </p>
                            <div className="mt-3 flex items-center justify-between">
                              <Badge
                                variant="outline"
                                className={cn("text-[10px] font-medium", colorPrioridad[tarea.prioridad])}
                              >
                                {labelPrioridad[tarea.prioridad]}
                              </Badge>
                              {tarea.promptAI && (
                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-chart-4/15">
                                  <Sparkles className="h-3 w-3 text-chart-4" />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {tareas.length === 0 && (
                        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border/60">
                          <p className="text-xs text-muted-foreground">Sin tareas</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Task Detail Sheet */}
      <Sheet open={!!tareaSeleccionada} onOpenChange={() => setTareaSeleccionada(null)}>
        <SheetContent className="w-full border-border sm:max-w-lg">
          {tareaSeleccionada && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("text-[10px]", colorPrioridad[tareaSeleccionada.prioridad])}
                  >
                    {labelPrioridad[tareaSeleccionada.prioridad]}
                  </Badge>
                </div>
                <SheetTitle className="text-lg">{tareaSeleccionada.titulo}</SheetTitle>
                <SheetDescription>{tareaSeleccionada.descripcion}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
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
                      <Sparkles className="h-3.5 w-3.5 text-chart-4" />
                      Prompt sugerido para AI
                    </h4>
                    <div className="rounded-lg border border-chart-4/20 bg-chart-4/5 p-3.5">
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
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
