"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Lightbulb, Target, Zap } from "lucide-react"

interface NewProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCrear: (proyecto: {
    nombre: string
    descripcion: string
    tipo: string
  }) => void
}

export function NewProjectDialog({ open, onOpenChange, onCrear }: NewProjectDialogProps) {
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [tipo, setTipo] = useState("startup")

  const handleSubmit = () => {
    if (nombre && descripcion) {
      onCrear({ nombre, descripcion, tipo })
      setNombre("")
      setDescripcion("")
      setTipo("startup")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-border">
        <DialogHeader>
          <DialogTitle>Nuevo Proyecto</DialogTitle>
          <DialogDescription>
            Describe tu idea y generaremos un plan MVP estructurado
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 md:grid-cols-[1fr,200px]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del proyecto</Label>
              <Input
                id="nombre"
                placeholder="Mi App Increíble"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de proyecto</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Idea de Startup</SelectItem>
                  <SelectItem value="hackathon">Hackathon</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="interno">Herramienta Interna</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción de la idea</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe tu idea de producto, el problema que resuelve y quién es tu usuario objetivo..."
                className="min-h-32 resize-none"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
            <h4 className="text-sm font-medium text-foreground">Consejos</h4>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex gap-2">
                <Target className="h-4 w-4 shrink-0 text-chart-1" />
                <span>Mantén el alcance pequeño y enfocado</span>
              </div>
              <div className="flex gap-2">
                <Lightbulb className="h-4 w-4 shrink-0 text-chart-3" />
                <span>Enfócate en el valor core para el usuario</span>
              </div>
              <div className="flex gap-2">
                <Zap className="h-4 w-4 shrink-0 text-chart-4" />
                <span>Define un solo flujo principal para el MVP</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!nombre || !descripcion}>
            Generar Plan MVP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
