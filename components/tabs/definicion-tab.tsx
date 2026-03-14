"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Target, Lightbulb, Layers, Code2 } from "lucide-react"

interface Proyecto {
  id: string
  nombre: string
  descripcion: string
  estado: "activo" | "pausado" | "completado"
  problema?: string
  alcanceMvp?: string
  arquitectura?: string
  techStack?: string[]
}

interface DefinicionTabProps {
  proyecto: Proyecto
}

export function DefinicionTab({ proyecto }: DefinicionTabProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="grid gap-6">
          {/* Problema */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-1/10">
                  <Target className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <CardTitle className="text-base">Problema</CardTitle>
                  <CardDescription>El problema que resuelve este MVP</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {proyecto.problema ||
                  "Los desarrolladores y founders pierden tiempo valioso estructurando sus ideas de proyecto manualmente, sin una guía clara para definir el alcance del MVP o planificar los sprints de desarrollo."}
              </p>
            </CardContent>
          </Card>

          {/* Alcance MVP */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-2/10">
                  <Lightbulb className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <CardTitle className="text-base">Alcance MVP</CardTitle>
                  <CardDescription>Funcionalidades core del producto mínimo viable</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-2" />
                  Captura y almacenamiento de ideas de proyecto
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-2" />
                  Generación automática de plan MVP
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-2" />
                  Tablero Kanban para gestión de sprints
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-2" />
                  Documentación del proyecto
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Arquitectura */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-3/10">
                  <Layers className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <CardTitle className="text-base">Arquitectura Recomendada</CardTitle>
                  <CardDescription>Estructura técnica sugerida</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <pre className="text-xs text-muted-foreground">
{`├── Frontend (Next.js App Router)
│   ├── /app
│   │   ├── page.tsx (Dashboard)
│   │   └── /proyecto/[id]
│   └── /components
├── Backend (API Routes)
│   └── /api
│       ├── /proyectos
│       └── /mvp/generar
└── Base de Datos (PostgreSQL)`}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-4/10">
                  <Code2 className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <CardTitle className="text-base">Stack Tecnológico</CardTitle>
                  <CardDescription>Tecnologías recomendadas para el desarrollo</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(proyecto.techStack || ["Next.js", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "PostgreSQL", "Vercel"]).map(
                  (tech) => (
                    <Badge key={tech} variant="secondary" className="px-3 py-1">
                      {tech}
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  )
}
