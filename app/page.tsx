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

function HomePageContent() {
  const router = useRouter()
  const usuario = useStore((state) => state.usuario)
  const pedidos = useStore((state) => state.pedidos)
  const getCantidadTotal = useStore((state) => state.getCantidadTotal)
  const getTotalCarrito = useStore((state) => state.getTotalCarrito)

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

  const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente").length
  const pedidosEnviados = pedidos.filter((p) => p.estado === "enviado").length
  const pedidosEntregados = pedidos.filter((p) => p.estado === "entregado").length
  const cantidadCarrito = getCantidadTotal()
  const totalCarrito = getTotalCarrito()

  const cartillasDestacadas = catalogoCartillas.filter((c) => c.disponible).slice(0, 4)

  const estadisticas = [
    {
      titulo: "Cartillas Disponibles",
      valor: catalogoCartillas.filter((c) => c.disponible).length,
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
      valor: pedidosPendientes + pedidosEnviados,
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
        {/* Saludo */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-balance">
            Bienvenido, {usuario.nombre.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Explora el catálogo de cartillas y gestiona tus pedidos desde aquí.
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
                          {pedidosPendientes + pedidosEnviados} pedidos activos
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
        {pedidos.length > 0 && (
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
                {pedidos.slice(0, 3).map((pedido) => (
                  <div
                    key={pedido.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                        <Package className="size-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Pedido #{pedido.id.split("_")[1]}</p>
                        <p className="text-sm text-muted-foreground">
                          {pedido.items.length} artículo{pedido.items.length !== 1 ? "s" : ""} -{" "}
                          ${pedido.total.toLocaleString("es-MX")}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        pedido.estado === "entregado"
                          ? "default"
                          : pedido.estado === "enviado"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        pedido.estado === "entregado"
                          ? "bg-chart-2 text-white"
                          : pedido.estado === "enviado"
                          ? "bg-chart-1 text-white"
                          : ""
                      }
                    >
                      {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
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
