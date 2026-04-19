"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { useStore, Usuario } from "@/lib/store"
import authService from "@/lib/auth/authService"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const setAuthData = useStore((state) => state.setAuthData)
  const setAccessToken = useStore((state) => state.setAccessToken)
  const [isLoading, setIsLoading] = useState(true)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false)

  // Primera verificación: cuando el componente se monta
  useEffect(() => {
    // Solo esperar a que NextAuth termine de cargar
    if (sessionStatus === "loading") {
      return
    }

    // Si tenemos una sesión de NextAuth, sincronizar con el store
    if (session?.user) {
      const usuario: Usuario = {
        id: (session.user as any).id || "",
        email: session.user.email || "",
        firstName: (session.user as any).firstName || "",
        lastName: (session.user as any).lastName || "",
        rol: ((session.user as any).role || "CURSANTE") as "CURSANTE" | "ADMIN" | "EMPLEADO",
      }
      const token = authService.getToken()
      if (token) {
        setAuthData(token, usuario)
      }
      setIsLoading(false)
      setHasCheckedAuth(true)
      return
    }

    // Si NextAuth dice que no hay sesión, verificar tokens locales
    if (sessionStatus === "unauthenticated") {
      const token = authService.getToken()
      const userData = authService.getUser()

      if (token && userData) {
        // Tenemos token guardado, sincronizar con el store
        const usuario: Usuario = {
          id: userData.id || "",
          email: userData.email || "",
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          rol: (userData.role || "CURSANTE") as "CURSANTE" | "ADMIN" | "EMPLEADO",
        }
        setAuthData(token, usuario)
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
  }, [sessionStatus, session, setAuthData, setAccessToken])

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
