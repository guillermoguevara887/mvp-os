"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Target, Lightbulb, Sparkles, Code2, Plus, X, Loader2 } from "lucide-react"
import type { Proyecto } from "@/types/project"

interface AiMvpData {
  problem?: string
  solution?: string
  features?: string[]
  tech_stack?: string[]
}

interface DefinicionTabProps {
  proyecto: Proyecto
  onTechStackChanged?: () => void
}

export function DefinicionTab({ proyecto, onTechStackChanged }: DefinicionTabProps) {
  const supabase = createClient()

  const [aiData, setAiData]       = useState<AiMvpData | null>(null)
  const [aiLoaded, setAiLoaded]   = useState(false)
  const [loadingAI, setLoadingAI] = useState(true)
  const [techStack, setTechStack]   = useState<string[]>([])
  const [saving, setSaving]         = useState(false)
  const [addingTech, setAddingTech] = useState(false)
  const [newTech, setNewTech]       = useState("")
  const [hasSprints, setHasSprints] = useState(false)
  const [confirmPending, setConfirmPending] = useState<string[] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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

      const respuesta = data?.respuesta as AiMvpData | null
      setAiData(respuesta)
      setTechStack(respuesta?.tech_stack ?? [])
      setAiLoaded(!!data)
      setLoadingAI(false)

      // Verificar si ya hay sprints generados
      const { count } = await supabase
        .from("project_sprints")
        .select("*", { count: "exact", head: true })
        .eq("project_id", proyecto.id)
      setHasSprints((count ?? 0) > 0)
    }

    fetchAI()
  }, [proyecto.id])

  /* ===== GUARDAR TECH STACK VÍA API ===== */

  async function saveTechStack(updated: string[], resetSprints = false) {
    if (!aiLoaded) return
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${proyecto.id}/tech-stack`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tech_stack: updated, reset_sprints: resetSprints }),
      })

      if (!res.ok) {
        const data = await res.json()
        console.error("Error guardando tech stack:", data.error)
        setTechStack(aiData?.tech_stack ?? [])
      } else {
        setAiData((prev) => prev ? { ...prev, tech_stack: updated } : prev)
        if (resetSprints) {
          setHasSprints(false)
          onTechStackChanged?.()
        }
      }
    } finally {
      setSaving(false)
    }
  }

  /* ===== PEDIR CONFIRMACIÓN SI HAY SPRINTS ===== */

  function requestChange(updated: string[]) {
    if (hasSprints) {
      setConfirmPending(updated)
    } else {
      saveTechStack(updated)
    }
  }

  function handleConfirm() {
    if (confirmPending) {
      saveTechStack(confirmPending, true)
      setConfirmPending(null)
    }
  }

  function handleCancelConfirm() {
    setConfirmPending(null)
  }

  /* ===== AGREGAR ===== */

  async function handleAdd() {
    const value = newTech.trim()
    if (!value || techStack.includes(value)) return
    const updated = [...techStack, value]
    setTechStack(updated)
    setNewTech("")
    setAddingTech(false)
    requestChange(updated)
  }

  /* ===== ELIMINAR ===== */

  function handleRemove(tech: string) {
    const updated = techStack.filter((t) => t !== tech)
    setTechStack(updated)
    requestChange(updated)
  }

  /* ===== FOCO AL ABRIR INPUT ===== */

  useEffect(() => {
    if (addingTech) inputRef.current?.focus()
  }, [addingTech])

  return (
    <>
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
                {loadingAI ? "Generando..." : aiData?.problem || "Sin datos aún"}
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
                  {aiData?.features?.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-chart-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Solución */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-3/10">
                  <Sparkles className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <CardTitle className="text-base">Solución</CardTitle>
                  <CardDescription>Propuesta de solución para el problema</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {loadingAI ? "Generando..." : aiData?.solution || "Sin datos aún"}
              </p>
            </CardContent>
          </Card>

          {/* Tech Stack */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-4/10">
                    <Code2 className="h-5 w-5 text-chart-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Stack Tecnológico</CardTitle>
                    <CardDescription>Tecnologías recomendadas para el desarrollo</CardDescription>
                  </div>
                </div>

                {/* Indicador guardando */}
                {saving && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loadingAI ? (
                <p className="text-sm text-muted-foreground">Generando...</p>
              ) : (
                <div className="flex flex-wrap items-center gap-2">

                  {/* Badges con botón X */}
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1 rounded-md border bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                    >
                      {tech}
                      <button
                        onClick={() => handleRemove(tech)}
                        disabled={saving}
                        className="ml-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                        title={`Eliminar ${tech}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}

                  {/* Input inline para agregar */}
                  {addingTech ? (
                    <div className="flex items-center gap-1">
                      <Input
                        ref={inputRef}
                        value={newTech}
                        onChange={(e) => setNewTech(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleAdd()
                          if (e.key === "Escape") { setAddingTech(false); setNewTech("") }
                        }}
                        placeholder="Ej: Prisma"
                        className="h-8 w-36 text-sm"
                      />
                      <Button size="sm" className="h-8" onClick={handleAdd} disabled={!newTech.trim()}>
                        Agregar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8"
                        onClick={() => { setAddingTech(false); setNewTech("") }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => setAddingTech(true)}
                      disabled={saving || !aiLoaded}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar
                    </Button>
                  )}

                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </ScrollArea>

    {/* Confirmación: borrar sprints */}

    <AlertDialog open={!!confirmPending} onOpenChange={(open) => { if (!open) handleCancelConfirm() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Modificar el stack tecnológico?</AlertDialogTitle>
          <AlertDialogDescription>
            Este proyecto ya tiene sprints generados. Si cambias el stack tecnológico,
            los sprints actuales serán <strong>eliminados</strong> y tendrás que regenerarlos
            para que reflejen las nuevas tecnologías.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelConfirm}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sí, modificar y borrar sprints
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
