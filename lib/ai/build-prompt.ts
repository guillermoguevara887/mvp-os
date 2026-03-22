export function buildPrompt(project: {
  nombre: string
  descripcion: string
  tipo: string
}) {
  return `
Genera un plan MVP para el siguiente proyecto.

Nombre: ${project.nombre}
Tipo: ${project.tipo}
Descripción: ${project.descripcion}

Responde ÚNICAMENTE en JSON válido con esta estructura exacta:

{
  "problem": "string",
  "solution": "string",
  "features": ["string"],
  "tech_stack": ["string"]
}

NO agregues texto adicional fuera del JSON.
`
}