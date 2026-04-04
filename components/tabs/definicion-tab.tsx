"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Target, Lightbulb, Layers, Code2 } from "lucide-react"
import type { Proyecto } from "@/types/project"

interface AiMvpData {
  problem?: string
  features?: string[]
  architecture?: string
  tech_stack?: string[]
}

interface DefinicionTabProps {
  proyecto: Proyecto
}

export function DefinicionTab({ proyecto }: DefinicionTabProps) {
  const supabase = createClient()

  const [aiData, setAiData] = useState<AiMvpData | null>(null)
  const [loadingAI, setLoadingAI] = useState(true)

  useEffect(() => {
    async function fetchAI() {
      if (!proyecto?.id) return

      const { data, error } = await supabase
        .from("project_ai_requests")
        .select("*")
        .eq("project_id", proyecto.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error("Error AI:", error.message)
        setLoadingAI(false)
        return
      }

      console.log("AI DATA:", data?.respuesta) // 👈 debug útil

      setAiData(data?.respuesta)
      setLoadingAI(false)
    }

    fetchAI()
  }, [proyecto.id])

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
                {loadingAI
                  ? "Generando..."
                  : aiData?.problem || "Sin datos aún"}
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
              {loadingAI ? (
                <p className="text-sm text-muted-foreground">Generando...</p>
              ) : (
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {aiData?.features?.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
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
                  {loadingAI
                    ? "Generando..."
                    : aiData?.architecture || "Sin datos aún"}
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
                {(aiData?.tech_stack ?? [
                    "Next.js",
                    "React",
                    "TypeScript",
                    "Tailwind CSS",
                    "shadcn/ui",
                    "PostgreSQL",
                    "Vercel",
                  ]).map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </ScrollArea>
  )
}