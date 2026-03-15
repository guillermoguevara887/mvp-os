"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Copy, Pencil, Trash2, Sparkles, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Prompt {
  id: string
  titulo: string
  contenido: string
}

const promptsIniciales: Prompt[] = [
  {
    id: "p1",
    titulo: "Generar CRUD de proyectos",
    contenido: "Genera un CRUD completo para proyectos usando Next.js API routes y estado local en React.",
  },
  {
    id: "p2",
    titulo: "Crear componente de autenticación",
    contenido: "Crea un componente de login con validación de formulario, manejo de errores y redirección después del login exitoso.",
  },
  {
    id: "p3",
    titulo: "Diseñar sistema de notificaciones",
    contenido: "Diseña un sistema de notificaciones toast con diferentes tipos (success, error, warning, info) usando React context.",
  },
]

export function PromptsTab() {
  const [prompts, setPrompts] = useState<Prompt[]>(promptsIniciales)
  const [dialogoCrear, setDialogoCrear] = useState(false)
  const [dialogoEditar, setDialogoEditar] = useState<Prompt | null>(null)
  const [dialogoEliminar, setDialogoEliminar] = useState<Prompt | null>(null)
  const [copiado, setCopiado] = useState<string | null>(null)
  const [formPrompt, setFormPrompt] = useState({ titulo: "", contenido: "" })

  const handleCrear = () => {
    if (!formPrompt.titulo.trim() || !formPrompt.contenido.trim()) return

    const nuevoPrompt: Prompt = {
      id: `p-${Date.now()}`,
      titulo: formPrompt.titulo,
      contenido: formPrompt.contenido,
    }

    setPrompts((prev) => [...prev, nuevoPrompt])
    setDialogoCrear(false)
    setFormPrompt({ titulo: "", contenido: "" })
  }

  const handleEditar = () => {
    if (!dialogoEditar || !formPrompt.titulo.trim() || !formPrompt.contenido.trim()) return

    setPrompts((prev) =>
      prev.map((p) =>
        p.id === dialogoEditar.id
          ? { ...p, titulo: formPrompt.titulo, contenido: formPrompt.contenido }
          : p
      )
    )
    setDialogoEditar(null)
    setFormPrompt({ titulo: "", contenido: "" })
  }

  const handleEliminar = () => {
    if (!dialogoEliminar) return

    setPrompts((prev) => prev.filter((p) => p.id !== dialogoEliminar.id))
    setDialogoEliminar(null)
  }

  const handleCopiar = async (prompt: Prompt) => {
    await navigator.clipboard.writeText(prompt.contenido)
    setCopiado(prompt.id)
    setTimeout(() => setCopiado(null), 2000)
  }

  const abrirEditar = (prompt: Prompt) => {
    setFormPrompt({ titulo: prompt.titulo, contenido: prompt.contenido })
    setDialogoEditar(prompt)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Prompts del Proyecto</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Guarda prompts utiles para generar codigo, arquitectura o tareas con IA.
            </p>
          </div>
          <Button onClick={() => setDialogoCrear(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Prompt
          </Button>
        </div>

        {/* Prompt Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="group overflow-hidden border-border bg-card transition-all hover:shadow-md"
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground line-clamp-1">
                      {prompt.titulo}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {prompt.contenido}
                </p>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={() => handleCopiar(prompt)}
                  >
                    {copiado === prompt.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-500" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copiar
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => abrirEditar(prompt)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => setDialogoEliminar(prompt)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {prompts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Sparkles className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-medium text-foreground">No hay prompts</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Crea tu primer prompt para empezar
              </p>
              <Button onClick={() => setDialogoCrear(true)} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Nuevo Prompt
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Crear Prompt */}
      <Dialog open={dialogoCrear} onOpenChange={setDialogoCrear}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Prompt</DialogTitle>
            <DialogDescription>
              Crea un nuevo prompt para guardar en el proyecto.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="prompt-titulo">Titulo del Prompt</Label>
              <Input
                id="prompt-titulo"
                placeholder="Ej: Generar CRUD de usuarios"
                value={formPrompt.titulo}
                onChange={(e) => setFormPrompt({ ...formPrompt, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt-contenido">Contenido del Prompt</Label>
              <Textarea
                id="prompt-contenido"
                placeholder="Escribe el prompt completo aqui..."
                value={formPrompt.contenido}
                onChange={(e) => setFormPrompt({ ...formPrompt, contenido: e.target.value })}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoCrear(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCrear}
              disabled={!formPrompt.titulo.trim() || !formPrompt.contenido.trim()}
            >
              Guardar Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Editar Prompt */}
      <Dialog open={!!dialogoEditar} onOpenChange={() => setDialogoEditar(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Prompt</DialogTitle>
            <DialogDescription>
              Modifica el titulo o contenido del prompt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-prompt-titulo">Titulo del Prompt</Label>
              <Input
                id="edit-prompt-titulo"
                value={formPrompt.titulo}
                onChange={(e) => setFormPrompt({ ...formPrompt, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-prompt-contenido">Contenido del Prompt</Label>
              <Textarea
                id="edit-prompt-contenido"
                value={formPrompt.contenido}
                onChange={(e) => setFormPrompt({ ...formPrompt, contenido: e.target.value })}
                rows={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoEditar(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleEditar}
              disabled={!formPrompt.titulo.trim() || !formPrompt.contenido.trim()}
            >
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Eliminar Prompt */}
      <Dialog open={!!dialogoEliminar} onOpenChange={() => setDialogoEliminar(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar Prompt</DialogTitle>
            <DialogDescription>
              Esta accion no se puede deshacer. El prompt sera eliminado permanentemente.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoEliminar(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleEliminar}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
