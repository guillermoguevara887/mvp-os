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
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <FolderKanban className="h-6 w-6 text-primary" />
          </div>

          <CardTitle className="text-center">
            Acceso a MVPOS
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-full" onClick={handleSignUp}>
            Crear cuenta
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignIn}
          >
            Iniciar sesión
          </Button>

          {mensaje && (
            <p className="text-center text-sm text-muted-foreground">
              {mensaje}
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  )
}