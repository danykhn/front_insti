"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  BookOpen,
  ShoppingCart,
  Package,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore, catalogoCartillas } from "@/lib/store"
import { AuthGuard } from "@/components/auth-guard"
import { useHomeStats } from "@/lib/hooks/useHomeStats"

function HomePageContent() {
  const router = useRouter()
  const usuario = useStore((state) => state.usuario)
  const setRol = useStore((state) => state.setRol)
  const getCantidadTotal = useStore((state) => state.getCantidadTotal)
  const getTotalCarrito = useStore((state) => state.getTotalCarrito)
  
  // Get real stats from API
  const { 
    cartillasDisponibles, 
    carritoCantidad, 
    carritoTotal, 
    pedidosActivos, 
    pedidosEntregados, 
    pedidosRecientes, 
    cartillasDestacadas,
    recargar,
    loading: statsLoading 
  } = useHomeStats()

  // Redirigir según el rol del usuario
  useEffect(() => {
    if (usuario.rol === "ADMIN") {
      router.push("/admin")
    } else if (usuario.rol === "EMPLEADO") {
      router.push("/empleado")
    }
  }, [usuario.rol, router])

  // Si el usuario es ADMIN o EMPLEADO, mostrar loader mientras se redirige
  if (usuario.rol !== "CURSANTE") {
    return (
      <DashboardLayout title="Inicio">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Redirigiendo...</p>
        </div>
      </DashboardLayout>
    )
  }

  const cantidadCarrito = getCantidadTotal()
  const totalCarrito = getTotalCarrito()

  const estadisticas = statsLoading ? [
    { titulo: "Cartillas Disponibles", valor: "...", icono: BookOpen, color: "text-primary", bgColor: "bg-primary/10" },
    { titulo: "En tu Carrito", valor: 0, icono: ShoppingCart, color: "text-accent", bgColor: "bg-accent/10" },
    { titulo: "Pedidos Activos", valor: 0, icono: Package, color: "text-chart-3", bgColor: "bg-chart-3/10" },
    { titulo: "Pedidos Entregados", valor: 0, icono: CheckCircle, color: "text-chart-2", bgColor: "bg-chart-2/10" },
  ] : [
    {
      titulo: "Cartillas Disponibles",
      valor: cartillasDisponibles,
      icono: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      titulo: "En tu Carrito",
      valor: cantidadCarrito,
      icono: ShoppingCart,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      titulo: "Pedidos Activos",
      valor: pedidosActivos,
      icono: Package,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      titulo: "Pedidos Entregados",
      valor: pedidosEntregados,
      icono: CheckCircle,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  return (
    <DashboardLayout title="Inicio">
      <div className="flex flex-col gap-6">
        {/* Banner de selección de rol para testing - SOLO EN DESARROLLO */}
        {process.env.NODE_ENV === "development" && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-semibold text-blue-900">🔧 Modo de Prueba - Cambiar Rol</p>
                <p className="text-sm text-blue-800">Selecciona un rol para ver las vistas correspondientes:</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['CURSANTE', 'ADMIN', 'EMPLEADO'] as const).map((rol) => (
                  <Button
                    key={rol}
                    variant={usuario.rol === rol ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRol(rol)}
                  >
                    {rol === 'CURSANTE' && '👨‍🎓'}
                    {rol === 'ADMIN' && '👨‍💼'}
                    {rol === 'EMPLEADO' && '👷'}
                    {' '}
                    {rol}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Saludo */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-balance">
            Bienvenido, {usuario.firstName || ""}
          </h1>
          <p className="text-muted-foreground">
            Rol: <span className="font-semibold">{usuario.rol}</span>
            {usuario.rol === 'CURSANTE' && ' - Explora el catálogo de cartillas y gestiona tus pedidos desde aquí.'}
            {usuario.rol === 'ADMIN' && ' - Panel de administración del sistema.'}
            {usuario.rol === 'EMPLEADO' && ' - Panel de procesamiento de pedidos.'}
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {estadisticas.map((stat) => (
            <Card key={stat.titulo}>
              <CardContent className="flex items-center gap-4 pt-0">
                <div className={`flex size-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <stat.icono className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.valor}</p>
                  <p className="text-sm text-muted-foreground">{stat.titulo}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acciones rápidas y carrito */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Acciones rápidas */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/catalogo">
                    <div className="flex w-full items-center gap-3">
                      <BookOpen className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Ver Catálogo</p>
                        <p className="text-xs text-primary-foreground/70">
                          Explora todas las cartillas
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/pedidos">
                    <div className="flex w-full items-center gap-3">
                      <Package className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Mis Pedidos</p>
                        <p className="text-xs text-muted-foreground">
                          {pedidosActivos || 0} pedidos activos
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/pagos">
                    <div className="flex w-full items-center gap-3">
                      <CreditCard className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Historial de Pagos</p>
                        <p className="text-xs text-muted-foreground">
                          Revisa tus transacciones
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/perfil">
                    <div className="flex w-full items-center gap-3">
                      <TrendingUp className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Mi Perfil</p>
                        <p className="text-xs text-muted-foreground">
                          Actualiza tu información
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Estado del carrito */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-5" />
                Tu Carrito
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {cantidadCarrito > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Artículos:</span>
                    <span className="font-medium">{cantidadCarrito}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="text-xl font-bold text-primary">
                      ${totalCarrito.toLocaleString("es-MX")}
                    </span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/carrito">
                      Ir al Carrito
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                    <ShoppingCart className="size-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/catalogo">Explorar Catálogo</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cartillas destacadas */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Cartillas Destacadas</CardTitle>
              <CardDescription>Las más populares de este mes</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/catalogo">
                Ver Todas
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {cartillasDestacadas.map((cartilla) => (
                <div
                  key={cartilla.id}
                  className="group flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-md bg-muted">
                    <img
                      src={cartilla.imagen}
                      alt={cartilla.titulo}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="w-fit text-xs">
                      {cartilla.materia}
                    </Badge>
                    <h3 className="line-clamp-2 font-medium leading-tight">{cartilla.titulo}</h3>
                    <p className="text-lg font-bold text-primary">
                      ${cartilla.precio.toLocaleString("es-MX")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pedidos recientes */}
        {(pedidosRecientes?.length > 0) && (
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Pedidos Recientes</CardTitle>
                <CardDescription>Últimos movimientos de tus pedidos</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/pedidos">
                  Ver Todos
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {pedidosRecientes.slice(0, 3).map((pedido: any) => (
                  <div
                    key={pedido.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Package className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Pedido #{pedido.numeroOrden || pedido.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {pedido.cantidad_total || pedido.articulos?.length || 0} artículo(s) -{" "}
                          ${pedido.precio_total?.toLocaleString("es-MX") || 0}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        pedido.estado === "COMPLETADO"
                          ? "default"
                          : pedido.estado === "PAGADO"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        pedido.estado === "COMPLETADO"
                          ? "bg-green-600 text-white"
                          : pedido.estado === "PAGADO"
                          ? "bg-blue-600 text-white"
                          : ""
                      }
                    >
                      {pedido.estado}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function HomePage() {
  return (
    <AuthGuard>
      <HomePageContent />
    </AuthGuard>
  )
}
