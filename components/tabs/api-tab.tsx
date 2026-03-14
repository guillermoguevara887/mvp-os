"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Proyecto {
  id: string
  nombre: string
}

interface ApiTabProps {
  proyecto: Proyecto
}

interface Endpoint {
  metodo: "GET" | "POST" | "PUT" | "DELETE"
  ruta: string
  descripcion: string
  ejemplo: string
}

const endpoints: Endpoint[] = [
  {
    metodo: "GET",
    ruta: "/api/proyectos",
    descripcion: "Obtener lista de todos los proyectos",
    ejemplo: `{
  "proyectos": [
    {
      "id": "proj_123",
      "nombre": "Mi Proyecto MVP",
      "estado": "activo",
      "creado": "2024-01-15T10:00:00Z"
    }
  ]
}`,
  },
  {
    metodo: "POST",
    ruta: "/api/proyectos",
    descripcion: "Crear un nuevo proyecto",
    ejemplo: `// Request
{
  "nombre": "Nueva App",
  "descripcion": "Descripción del proyecto",
  "tipo": "saas"
}

// Response
{
  "id": "proj_456",
  "nombre": "Nueva App",
  "estado": "activo"
}`,
  },
  {
    metodo: "GET",
    ruta: "/api/proyectos/:id",
    descripcion: "Obtener detalles de un proyecto específico",
    ejemplo: `{
  "id": "proj_123",
  "nombre": "Mi Proyecto MVP",
  "descripcion": "...",
  "estado": "activo",
  "mvpPlan": {
    "problema": "...",
    "alcance": "...",
    "arquitectura": "..."
  }
}`,
  },
  {
    metodo: "POST",
    ruta: "/api/mvp/generar",
    descripcion: "Generar plan MVP a partir de una descripción",
    ejemplo: `// Request
{
  "descripcion": "Una app para gestionar...",
  "tipo": "startup"
}

// Response (streaming)
{
  "problema": "...",
  "alcanceMvp": [...],
  "arquitectura": "...",
  "techStack": [...],
  "sprints": [...]
}`,
  },
  {
    metodo: "PUT",
    ruta: "/api/proyectos/:id/sprints",
    descripcion: "Actualizar sprints de un proyecto",
    ejemplo: `// Request
{
  "sprints": [
    {
      "id": "sprint-1",
      "nombre": "Sprint 1",
      "tareas": [...]
    }
  ]
}

// Response
{
  "success": true,
  "sprints": [...]
}`,
  },
  {
    metodo: "DELETE",
    ruta: "/api/proyectos/:id",
    descripcion: "Eliminar un proyecto",
    ejemplo: `// Response
{
  "success": true,
  "message": "Proyecto eliminado"
}`,
  },
]

const colorMetodo = {
  GET: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  POST: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  PUT: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  DELETE: "bg-destructive/10 text-destructive border-destructive/20",
}

export function ApiTab({ proyecto }: ApiTabProps) {
  const copiarAlPortapapeles = (texto: string) => {
    navigator.clipboard.writeText(texto)
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground">Referencia de API</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Endpoints disponibles para integrar MVPOS en tu flujo de trabajo
          </p>
        </div>

        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <Card key={index} className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={colorMetodo[endpoint.metodo]}>
                    {endpoint.metodo}
                  </Badge>
                  <code className="text-sm font-mono text-foreground">{endpoint.ruta}</code>
                </div>
                <CardDescription className="mt-2">{endpoint.descripcion}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7"
                    onClick={() => copiarAlPortapapeles(endpoint.ejemplo)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <pre className="rounded-lg border border-border bg-muted/50 p-4 overflow-x-auto">
                    <code className="text-xs text-muted-foreground">{endpoint.ejemplo}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">Autenticación</CardTitle>
            <CardDescription>
              Todas las peticiones requieren un token de API en el header
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="rounded-lg border border-border bg-muted/50 p-4">
              <code className="text-xs text-muted-foreground">
{`curl -X GET "https://api.mvpos.dev/proyectos" \\
  -H "Authorization: Bearer tu_api_key" \\
  -H "Content-Type: application/json"`}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
