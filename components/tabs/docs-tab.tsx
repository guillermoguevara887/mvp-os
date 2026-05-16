"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Copy, Check } from "lucide-react"
import type { Proyecto } from "@/types/project"

interface CompletedSprint {
  id: string
  sprint_number: number
  summary: string
  created_at: string
}

interface DocsTabProps {
  proyecto: Proyecto
}

export function DocsTab({ proyecto }: DocsTabProps) {
  const [completedSprints, setCompletedSprints] = useState<CompletedSprint[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function handleCopy(sprint: CompletedSprint) {
    navigator.clipboard.writeText(sprint.summary).then(() => {
      setCopiedId(sprint.id)
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  useEffect(() => {
    async function fetchCompletedSprints() {
      const supabase = createClient()
      const { data } = await supabase
        .from("project_completed_sprints")
        .select("id, sprint_number, summary, created_at")
        .eq("project_id", proyecto.id)
        .order("sprint_number")

      setCompletedSprints(data ?? [])
      setLoading(false)
    }

    fetchCompletedSprints()
  }, [proyecto.id])

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-4 md:space-y-6 md:p-6">

        {/* Project overview */}
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold">{proyecto.nombre}</h1>
            {proyecto.descripcion && (
              <p className="mt-2 text-muted-foreground">{proyecto.descripcion}</p>
            )}
          </CardContent>
        </Card>

        {/* Completed sprints */}
        <div>
          <h2 className="mb-3 text-base font-semibold">Sprints finalizados</h2>

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-primary" />
              Cargando...
            </div>
          )}

          {!loading && completedSprints.length === 0 && (
            <Card className="border-border bg-card">
              <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
                Aún no hay sprints finalizados. Completa todas las tareas de un sprint y haz clic en "Finalizar sprint".
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {completedSprints.map((sprint) => (
              <Card key={sprint.id} className="border-border bg-card">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <h3 className="font-semibold">Sprint {sprint.sprint_number}</h3>
                    </div>
                    <button
                      onClick={() => handleCopy(sprint)}
                      title={copiedId === sprint.id ? "Copiado" : "Copiar resumen"}
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {copiedId === sprint.id
                        ? <Check className="h-4 w-4 text-green-500" />
                        : <Copy className="h-4 w-4" />
                      }
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {sprint.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </ScrollArea>
  )
}
