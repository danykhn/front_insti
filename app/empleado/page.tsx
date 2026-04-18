"use client"

import {
  Package,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"

function EmpleadoPageContent() {
  const usuario = useStore((state) => state.usuario)
  const pedidos = useStore((state) => state.pedidos)

  // Datos simulados para estadísticas de empleado
  const pedidosAsignados = pedidos.length
  const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente").length
  const pedidosEnviados = pedidos.filter((p) => p.estado === "enviado").length
  const pedidosEntregados = pedidos.filter((p) => p.estado === "entregado").length

  const estadisticas = [
    {
      titulo: "Pedidos Asignados",
      valor: pedidosAsignados,
      icono: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
      subtitulo: "En total",
    },
    {
      titulo: "Pendientes",
      valor: pedidosPendientes,
      icono: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      subtitulo: "Requieren procesamiento",
    },
    {
      titulo: "Enviados",
      valor: pedidosEnviados,
      icono: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      subtitulo: "En camino",
    },
    {
      titulo: "Entregados",
      valor: pedidosEntregados,
      icono: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      subtitulo: "Completados",
    },
  ]

  return (
    <DashboardLayout title="Panel de Empleado">
      <div className="flex flex-col gap-6">
        {/* Saludo */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-balance">
            Bienvenido, {usuario.nombre.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Gestión de pedidos y seguimiento de envíos.
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {estadisticas.map((stat) => (
            <Card key={stat.titulo}>
              <CardContent className="flex flex-col gap-3 pt-6">
                <div className="flex items-center justify-between">
                  <div className={`flex size-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                    <stat.icono className={`size-6 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.valor}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.titulo}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitulo}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acciones principales */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Acciones rápidas */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Funciones principales para el procesamiento de pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/empleado/pedidos">
                    <div className="flex w-full items-center gap-3">
                      <Package className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Gestionar Pedidos</p>
                        <p className="text-xs text-primary-foreground/70">
                          {pedidosPendientes} pendientes
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/empleado/usuarios">
                    <div className="flex w-full items-center gap-3">
                      <Users className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Ver Usuarios</p>
                        <p className="text-xs text-muted-foreground">
                          Información de clientes
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/catalogo">
                    <div className="flex w-full items-center gap-3">
                      <AlertCircle className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Catálogo</p>
                        <p className="text-xs text-muted-foreground">
                          Ver disponibilidad
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Estado general */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5 text-chart-1" />
                Estado General
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-medium text-amber-900">{pedidosPendientes} Pendientes</p>
                <p className="text-xs text-amber-800 mt-1">Necesitan tu atención</p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm font-medium text-blue-900">{pedidosEnviados} En Tránsito</p>
                <p className="text-xs text-blue-800 mt-1">Camino al cliente</p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-sm font-medium text-green-900">{pedidosEntregados} Completados</p>
                <p className="text-xs text-green-800 mt-1">Entregados hoy</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pedidos pendientes por procesar */}
        {pedidosPendientes > 0 && (
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Pedidos Pendientes</CardTitle>
                <CardDescription>Pedidos que requieren procesamiento</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/empleado/pedidos">
                  Ver Todos
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {pedidos
                  .filter((p) => p.estado === "pendiente")
                  .slice(0, 5)
                  .map((pedido) => (
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
                            {pedido.items.length} artículo{pedido.items.length !== 1 ? "s" : ""} - ${pedido.total.toLocaleString("es-MX")}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
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

export default function EmpleadoPage() {
  return (
    <AuthGuard>
      <EmpleadoPageContent />
    </AuthGuard>
  )
}
