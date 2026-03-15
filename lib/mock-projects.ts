import type { Proyecto } from "@/types/project"

export const proyectosIniciales: Proyecto[] = [
  {
    id: "1",
    nombre: "MVPOS",
    descripcion: "Sistema de gestión de proyectos MVP para desarrolladores y founders",
    estado: "activo",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL"],
  },
  {
    id: "2",
    nombre: "ChatBot AI",
    descripcion: "Asistente virtual inteligente para atención al cliente",
    estado: "activo",
    techStack: ["Python", "FastAPI", "OpenAI", "Redis"],
  },
  {
    id: "3",
    nombre: "Marketplace Local",
    descripcion: "Plataforma de comercio electrónico para negocios locales",
    estado: "pausado",
    techStack: ["Next.js", "Stripe", "Supabase", "Tailwind CSS"],
  },
]