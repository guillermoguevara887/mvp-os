"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { GripVertical, Sparkles } from "lucide-react"

interface Tarea {
  id: string
  titulo: string
  descripcion: string
  prioridad: "alta" | "media" | "baja"
  explicacion?: string
  pasos?: string[]
  promptAI?: string
  checklist?: { item: string; completado: boolean }[]
}

interface Sprint {
  id: string
  nombre: string
  tareas: Tarea[]
}

const sprintsIniciales: Sprint[] = [
  {
    id: "sprint-1",
    nombre: "Sprint 1",
    tareas: [
      {
        id: "t1",
        titulo: "Configurar proyecto Next.js",
        descripcion: "Inicializar el proyecto con TypeScript y Tailwind",
        prioridad: "alta",
        explicacion: "La base del proyecto es fundamental. Next.js con App Router proporciona la mejor experiencia de desarrollo y rendimiento.",
        pasos: [
          "Ejecutar npx create-next-app@latest",
          "Configurar TypeScript strict mode",
          "Instalar y configurar Tailwind CSS",
          "Configurar shadcn/ui",
        ],
        promptAI: "Crea un proyecto Next.js con TypeScript, Tailwind CSS y shadcn/ui configurado con el tema oscuro por defecto.",
        checklist: [
          { item: "Proyecto inicializado", completado: false },
          { item: "TypeScript configurado", completado: false },
          { item: "Tailwind CSS funcionando", completado: false },
          { item: "shadcn/ui instalado", completado: false },
        ],
      },
      {
        id: "t2",
        titulo: "Diseñar layout principal",
        descripcion: "Crear el layout con sidebar y área de contenido",
        prioridad: "alta",
        explicacion: "El layout define la estructura visual de toda la aplicación. Un diseño consistente mejora la UX.",
        pasos: [
          "Crear componente Sidebar",
          "Implementar navegación responsiva",
          "Configurar el sistema de rutas",
        ],
        promptAI: "Diseña un layout de dashboard moderno con sidebar izquierdo estilo Linear/Notion.",
        checklist: [
          { item: "Sidebar creado", completado: false },
          { item: "Layout responsivo", completado: false },
        ],
      },
      {
        id: "t3",
        titulo: "Implementar sistema de proyectos",
        descripcion: "CRUD básico para gestionar proyectos",
        prioridad: "media",
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
    tareas: [
      {
        id: "t4",
        titulo: "Crear formulario de nuevo proyecto",
        descripcion: "Formulario para capturar ideas y generar MVP",
        prioridad: "alta",
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
    tareas: [
      {
        id: "t6",
        titulo: "Integrar generación AI",
        descripcion: "Conectar con API de AI para generar planes MVP",
        prioridad: "alta",
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
  alta: "bg-destructive/10 text-destructive border-destructive/20",
  media: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  baja: "bg-chart-2/10 text-chart-2 border-chart-2/20",
}

const labelPrioridad = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
}

export function SprintsTab() {
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(null)

  return (
    <>
      <div className="flex h-full">
        <ScrollArea className="flex-1">
          <div className="flex gap-6 p-6">
            {sprintsIniciales.map((sprint) => (
              <div key={sprint.id} className="w-80 shrink-0">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">{sprint.nombre}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {sprint.tareas.length} tareas
                  </Badge>
                </div>
                <div className="flex flex-col gap-3">
                  {sprint.tareas.map((tarea) => (
                    <Card
                      key={tarea.id}
                      className="cursor-pointer border-border bg-card transition-colors hover:bg-accent"
                      onClick={() => setTareaSeleccionada(tarea)}
                    >
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start gap-2">
                          <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/50" />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-foreground">
                              {tarea.titulo}
                            </h4>
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                              {tarea.descripcion}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={colorPrioridad[tarea.prioridad]}
                          >
                            {labelPrioridad[tarea.prioridad]}
                          </Badge>
                          {tarea.promptAI && (
                            <Sparkles className="h-3.5 w-3.5 text-chart-4" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Sheet open={!!tareaSeleccionada} onOpenChange={() => setTareaSeleccionada(null)}>
        <SheetContent className="w-full border-border sm:max-w-lg">
          {tareaSeleccionada && (
            <>
              <SheetHeader>
                <SheetTitle className="text-lg">{tareaSeleccionada.titulo}</SheetTitle>
                <SheetDescription>{tareaSeleccionada.descripcion}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {tareaSeleccionada.explicacion && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-foreground">
                      Por qué es importante
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {tareaSeleccionada.explicacion}
                    </p>
                  </div>
                )}

                {tareaSeleccionada.pasos && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-foreground">
                      Pasos de implementación
                    </h4>
                    <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                      {tareaSeleccionada.pasos.map((paso, index) => (
                        <li key={index}>{paso}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {tareaSeleccionada.promptAI && (
                  <div>
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                      <Sparkles className="h-4 w-4 text-chart-4" />
                      Prompt sugerido para AI
                    </h4>
                    <div className="rounded-lg border border-border bg-muted/50 p-3">
                      <p className="text-sm text-muted-foreground">
                        {tareaSeleccionada.promptAI}
                      </p>
                    </div>
                  </div>
                )}

                {tareaSeleccionada.checklist && (
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-foreground">
                      Checklist de aceptación
                    </h4>
                    <div className="space-y-2">
                      {tareaSeleccionada.checklist.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Checkbox id={`check-${index}`} />
                          <label
                            htmlFor={`check-${index}`}
                            className="text-sm text-muted-foreground"
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
