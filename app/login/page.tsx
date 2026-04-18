"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { BookOpen, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth"
import { useStore } from "@/lib/store"

export default function LoginPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { signIn: backendSignIn, googleLogin, isLoading: authLoading, error: authError } = useAuth()
  const storeLogin = useStore((state) => state.login)
  const setUsuario = useStore((state) => state.setUsuario)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState(authError || "")

  // Sincronizar sesión de NextAuth con el store y backend
  useEffect(() => {
    if (session?.user) {
      const syncGoogleLogin = async () => {
        try {
          // Llamar a googleLogin para sincronizar con el backend
          const result = await googleLogin(session.user);
          if (result) {
            const timer = setTimeout(() => {
              router.push("/")
            }, 500)
            return () => clearTimeout(timer)
          }
        } catch (err) {
          console.error('Error sincronizando con el backend:', err)
          // Aunque haya error, si tenemos sesión de NextAuth, podemos continuar
          const timer = setTimeout(() => {
            router.push("/")
          }, 500)
          return () => clearTimeout(timer)
        }
      }
      syncGoogleLogin()
    }
  }, [session?.user, googleLogin, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await backendSignIn(email, password)
      if (response) {
        router.push("/")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciales incorrectas")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")
    try {
      // Usar NextAuth para obtener el token de Google
      const result = await signIn("google", { redirect: false })
      
      if (!result?.ok && result?.error) {
        setError("Error al conectar con Google")
      }
      // No redirigir aquí, el useEffect se encargará cuando session cambie
    } catch (err: any) {
      setError("Error al conectar con Google: " + err.message)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-foreground">Sistema de Cartillas</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-8">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Bienvenido de nuevo
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Ingresa tus credenciales para acceder al portal estudiantil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu.correo@estudiante.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Contraseña
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Ingresa tu contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pr-10"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold"
                  disabled={isLoading || isGoogleLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      o continúa con
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    type="button" 
                    className="h-11" 
                    disabled={isLoading || isGoogleLoading}
                    onClick={handleGoogleSignIn}
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    )}
                    Google
                  </Button>
                  <Button variant="outline" type="button" className="h-11" disabled={isLoading || isGoogleLoading}>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Contacta a tu institución
                </button>
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Al iniciar sesión, aceptas nuestros{" "}
            <button className="underline hover:text-foreground">Términos de Servicio</button>
            {" "}y{" "}
            <button className="underline hover:text-foreground">Política de Privacidad</button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-sm text-muted-foreground">
        <p>&copy; 2025 Sistema de Cartillas. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
