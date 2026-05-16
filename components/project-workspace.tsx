"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DefinicionTab } from "@/components/tabs/definicion-tab"
import { SprintsTab } from "@/components/tabs/sprints-tab"
import { DocsTab } from "@/components/tabs/docs-tab"
import { ApiTab } from "@/components/tabs/api-tab"
import { PromptsTab } from "@/components/tabs/prompts-tab"
import { X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Proyecto } from "@/types/project"

interface ProjectWorkspaceProps {
  proyecto: Proyecto
  onCerrar: () => void
  onAbrirSidebar?: () => void
}

export function ProjectWorkspace({ proyecto, onCerrar, onAbrirSidebar }: ProjectWorkspaceProps) {
  const [sprintResetKey, setSprintResetKey] = useState(0)

  const handleTechStackChanged = () => {
    setSprintResetKey((k) => k + 1)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-2">
          {/* Botón hamburguesa — solo en mobile, cuando hay proyecto activo */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 md:hidden"
            onClick={onAbrirSidebar}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="truncate text-base font-semibold text-foreground md:text-lg">{proyecto.nombre}</h1>
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={onCerrar}>
          <X className="h-4 w-4" />
        </Button>
      </header>

      <Tabs defaultValue="definicion" className="flex flex-1 flex-col overflow-hidden">
        {/* Tab bar: bottom-border en mobile, pill en desktop */}
        <div className="shrink-0 border-b border-border md:border-none md:px-4 md:py-3">
          <TabsList className="flex h-auto w-full rounded-none bg-transparent p-0 md:inline-flex md:h-10 md:w-auto md:rounded-full md:bg-muted/50 md:p-1">
            <TabsTrigger
              value="definicion"
              className="flex-1 rounded-none border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none md:flex-none md:rounded-full md:border-0 md:px-4 md:py-1.5 md:data-[state=active]:bg-card md:data-[state=active]:shadow-sm"
            >
              Definición
            </TabsTrigger>
            <TabsTrigger
              value="sprints"
              className="flex-1 rounded-none border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none md:flex-none md:rounded-full md:border-0 md:px-4 md:py-1.5 md:data-[state=active]:bg-card md:data-[state=active]:shadow-sm"
            >
              Sprints
            </TabsTrigger>
            <TabsTrigger
              value="docs"
              className="flex-1 rounded-none border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none md:flex-none md:rounded-full md:border-0 md:px-4 md:py-1.5 md:data-[state=active]:bg-card md:data-[state=active]:shadow-sm"
            >
              Docs
            </TabsTrigger>
            <TabsTrigger
              value="api"
              className="flex-1 rounded-none border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none md:flex-none md:rounded-full md:border-0 md:px-4 md:py-1.5 md:data-[state=active]:bg-card md:data-[state=active]:shadow-sm"
            >
              API
            </TabsTrigger>
            <TabsTrigger
              value="prompts"
              className="flex-1 rounded-none border-b-2 border-transparent py-3 text-sm font-medium text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none md:flex-none md:rounded-full md:border-0 md:px-4 md:py-1.5 md:data-[state=active]:bg-card md:data-[state=active]:shadow-sm"
            >
              Prompts
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="min-h-0 flex-1">
          <TabsContent value="definicion" className="m-0 h-full overflow-y-auto">
            <DefinicionTab proyecto={proyecto} onTechStackChanged={handleTechStackChanged} />
          </TabsContent>
          <TabsContent value="sprints" className="m-0 h-full overflow-hidden">
            <SprintsTab key={sprintResetKey} projectId={proyecto.id} />
          </TabsContent>
          <TabsContent value="docs" className="m-0 h-full overflow-y-auto">
            <DocsTab proyecto={proyecto} />
          </TabsContent>
          <TabsContent value="api" className="m-0 h-full overflow-y-auto">
            <ApiTab />
          </TabsContent>
          <TabsContent value="prompts" className="m-0 h-full overflow-y-auto">
            <PromptsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
