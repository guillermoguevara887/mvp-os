"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FolderKanban } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mensaje, setMensaje] = useState("")

  // ✅ CREAR CUENTA
  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMensaje(error.message)
      return
    }

    router.push("/dashboard") // 🔥 redirige
  }

  // ✅ LOGIN
  async function handleSignIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMensaje(error.message)
      return
    }

    router.push("/dashboard") // 🔥 CLAVE
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="flex flex-col items-center gap-3 pb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <FolderKanban className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-1 text-center">
            <CardTitle>Acceso a MVPOS</CardTitle>
            <p className="text-sm text-muted-foreground">
              Inicia sesión o crea tu cuenta para continuar
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <Input
            type="email"
            placeholder="Correo electrónico"
            className="h-11"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            suppressHydrationWarning
          />

          <Input
            type="password"
            placeholder="Contraseña"
            className="h-11"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            suppressHydrationWarning
          />

          <div className="space-y-2 pt-1">
            <Button className="h-11 w-full" onClick={handleSignIn}>
              Iniciar sesión
            </Button>

            <Button
              variant="outline"
              className="h-11 w-full"
              onClick={handleSignUp}
            >
              Crear cuenta
            </Button>
          </div>

          {mensaje && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              {mensaje}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}