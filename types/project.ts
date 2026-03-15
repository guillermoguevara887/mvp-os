

export interface Proyecto {
  id: string
  nombre: string
  descripcion: string
  estado: "activo" | "pausado" | "completado"
  problema?: string
  alcanceMvp?: string
  arquitectura?: string
  techStack?: string[]
}
