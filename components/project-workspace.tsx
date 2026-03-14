"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DefinicionTab } from "@/components/tabs/definicion-tab"
import { SprintsTab } from "@/components/tabs/sprints-tab"
import { DocsTab } from "@/components/tabs/docs-tab"
import { ApiTab } from "@/components/tabs/api-tab"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface ProjectWorkspaceProps {
  proyecto: Proyecto
  onCerrar: () => void
}

export function ProjectWorkspace({ proyecto, onCerrar }: ProjectWorkspaceProps) {
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <h1 className="text-lg font-semibold text-foreground">{proyecto.nombre}</h1>
        <Button variant="ghost" size="icon" onClick={onCerrar}>
          <X className="h-4 w-4" />
        </Button>
      </header>

      <Tabs defaultValue="definicion" className="flex flex-1 flex-col">
        <div className="px-6 py-3">
          <TabsList className="inline-flex h-10 items-center justify-center gap-1 rounded-full bg-muted/50 p-1">
            <TabsTrigger
              value="definicion"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Definicion
            </TabsTrigger>
            <TabsTrigger
              value="sprints"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Sprints
            </TabsTrigger>
            <TabsTrigger
              value="docs"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Docs
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              API
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-0 flex-1">
          <TabsContent value="definicion" className="m-0 h-full overflow-y-auto">
            <DefinicionTab proyecto={proyecto} />
          </TabsContent>
          <TabsContent value="sprints" className="m-0 h-full overflow-hidden">
            <SprintsTab />
          </TabsContent>
          <TabsContent value="docs" className="m-0 h-full overflow-y-auto">
            <DocsTab proyecto={proyecto} />
          </TabsContent>
          <TabsContent value="api" className="m-0 h-full overflow-y-auto">
            <ApiTab proyecto={proyecto} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
