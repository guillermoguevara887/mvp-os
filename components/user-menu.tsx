"use client"

import { useUser } from "@/hooks/use-user"
import { Button } from "@/components/ui/button"


export function UserMenu() {
  const { user, loading, logout } = useUser()

  if (loading) return null

  return (
    <div className="flex items-center justify-between gap-2 border-t p-3">
      <div className="min-w-0 text-sm text-muted-foreground truncate">
        {user?.email}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-9 shrink-0"
        onClick={logout}
      >
        Salir
      </Button>
    </div>
  )
}