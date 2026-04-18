"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { useStore } from "@/lib/store"
import authService from "@/lib/auth/authService"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const [isLoading, setIsLoading] = useState(true)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  // Primera verificación: cuando el componente se monta
  useEffect(() => {
    // Solo esperar a que NextAuth termine de cargar
    if (sessionStatus === "loading") {
      return
    }

    // Si tenemos una sesión, no redirigir
    if (session?.user) {
      setIsLoading(false)
      setHasCheckedAuth(true)
      return
    }

    // Si NextAuth dice que no hay sesión, verificar tokens locales
    if (sessionStatus === "unauthenticated") {
      const hasToken = authService.getToken()
      if (hasToken && isAuthenticated) {
        setIsLoading(false)
        setHasCheckedAuth(true)
        return
      }

      // No hay sesión ni tokens, redirigir a login
      const timer = setTimeout(() => {
        router.push("/login")
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [sessionStatus, session, isAuthenticated, router])

  if (isLoading || !hasCheckedAuth || sessionStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
