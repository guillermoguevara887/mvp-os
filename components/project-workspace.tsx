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
        <div className="border-b border-border px-6">
          <TabsList className="h-12 bg-transparent p-0">
            <TabsTrigger
              value="definicion"
              className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Definición
            </TabsTrigger>
            <TabsTrigger
              value="sprints"
              className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Sprints
            </TabsTrigger>
            <TabsTrigger
              value="docs"
              className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Docs
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="rounded-none border-b-2 border-transparent px-4 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              API
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="definicion" className="m-0 h-full overflow-auto">
            <DefinicionTab proyecto={proyecto} />
          </TabsContent>
          <TabsContent value="sprints" className="m-0 h-full overflow-hidden">
            <SprintsTab />
          </TabsContent>
          <TabsContent value="docs" className="m-0 h-full overflow-auto">
            <DocsTab proyecto={proyecto} />
          </TabsContent>
          <TabsContent value="api" className="m-0 h-full overflow-auto">
            <ApiTab proyecto={proyecto} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
