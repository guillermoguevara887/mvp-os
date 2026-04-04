"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Proyecto } from "@/types/project"

interface DocsTabProps {
  proyecto: Proyecto
}

export function DocsTab({ proyecto }: DocsTabProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-pre:bg-muted prose-pre:border prose-pre:border-border">
              <h1>{proyecto.nombre}</h1>
              <p>{proyecto.descripcion}</p>

              <h2>Descripción General</h2>
              <p>
                MVPOS (Minimum Viable Project OS) es una herramienta diseñada para ayudar a
                desarrolladores, founders y participantes de hackathons a transformar ideas
                crudas en planes de ejecución MVP estructurados.
              </p>

              <h2>Características Principales</h2>
              <ul>
                <li>
                  <strong>Captura de Ideas:</strong> Pega tu idea de startup, concepto de
                  producto o descripción de hackathon.
                </li>
                <li>
                  <strong>Generación de Plan MVP:</strong> El sistema genera automáticamente
                  el alcance, arquitectura y stack tecnológico recomendado.
                </li>
                <li>
                  <strong>Tablero de Sprints:</strong> Visualiza y gestiona el desarrollo con
                  un tablero Kanban intuitivo.
                </li>
                <li>
                  <strong>Prompts AI:</strong> Cada tarea incluye prompts sugeridos para
                  asistentes de código.
                </li>
              </ul>

              <h2>Flujo de Trabajo</h2>
              <pre><code>{`1. Crear nuevo proyecto
2. Describir la idea o concepto
3. Revisar el plan MVP generado
4. Organizar sprints y tareas
5. Implementar usando los prompts sugeridos`}</code></pre>

              <h2>Configuración Inicial</h2>
              <p>
                Para comenzar a usar MVPOS en tu entorno local, sigue estos pasos:
              </p>
              <pre><code>{`# Clonar el repositorio
git clone https://github.com/tu-usuario/mvpos.git

# Instalar dependencias
cd mvpos
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar servidor de desarrollo
pnpm dev`}</code></pre>

              <h2>Variables de Entorno</h2>
              <table>
                <thead>
                  <tr>
                    <th>Variable</th>
                    <th>Descripción</th>
                    <th>Requerida</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>DATABASE_URL</code></td>
                    <td>URL de conexión a PostgreSQL</td>
                    <td>Sí</td>
                  </tr>
                  <tr>
                    <td><code>OPENAI_API_KEY</code></td>
                    <td>API key para generación AI</td>
                    <td>Sí</td>
                  </tr>
                  <tr>
                    <td><code>NEXT_PUBLIC_APP_URL</code></td>
                    <td>URL pública de la aplicación</td>
                    <td>No</td>
                  </tr>
                </tbody>
              </table>

              <h2>Contribuir</h2>
              <p>
                Las contribuciones son bienvenidas. Por favor, revisa las guías de
                contribución en el repositorio antes de enviar un PR.
              </p>
            </article>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}
