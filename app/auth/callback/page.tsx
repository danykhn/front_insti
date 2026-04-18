"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Este componente se usa para manejar la redirección después de NextAuth
    // La redirección real la maneja NextAuth automáticamente
    const token = searchParams.get("token")
    const user = searchParams.get("user")

    if (token && user) {
      try {
        // Guardar el token y usuario en localStorage
        localStorage.setItem("auth_token", token)
        localStorage.setItem("user_data", user)
        // Redirigir al dashboard
        router.push("/")
      } catch (error) {
        console.error("Error en callback:", error)
        router.push("/login")
      }
    } else {
      // Si no hay parámetros, redirigir al login
      router.push("/login")
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Completando autenticación...
        </p>
      </div>
    </div>
  )
}
