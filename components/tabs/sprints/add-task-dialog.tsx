"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface AddTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  sprintId: string
  onTaskCreated: (task: {
    id: string
    titulo: string
    descripcion: string
    prioridad: "alta" | "media" | "baja"
    estado: "todo"
    tipo: "feature"
  }) => void
}

export function AddTaskDialog({ open, onOpenChange, projectId, sprintId, onTaskCreated }: AddTaskDialogProps) {
  const [title, setTitle]           = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority]     = useState<"high" | "medium" | "low">("medium")
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState<string | null>(null)

  function reset() {
    setTitle("")
    setDescription("")
    setPriority("medium")
    setError(null)
  }

  function handleClose(open: boolean) {
    if (!open) reset()
    onOpenChange(open)
  }

  async function handleSubmit() {
    if (!title.trim()) return
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/projects/${projectId}/sprints/${sprintId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al crear la tarea")
        return
      }

      onTaskCreated({
        id: data.task.id,
        titulo: data.task.title,
        descripcion: data.task.description ?? "",
        prioridad: priority === "high" ? "alta" : priority === "low" ? "baja" : "media",
        estado: "todo",
        tipo: "feature",
      })

      reset()
      onOpenChange(false)
    } catch {
      setError("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar tarea</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label>Título <span className="text-destructive">*</span></Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Configurar autenticación"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) handleSubmit() }}
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Descripción <span className="text-muted-foreground text-xs">(opcional)</span></Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente la tarea..."
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Prioridad</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Crear tarea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
