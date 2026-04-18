"use client"

import {
  Users,
  Package,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  ArrowRight,
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { AuthGuard } from "@/components/auth-guard"
import Link from "next/link"

function AdminPageContent() {
  const usuario = useStore((state) => state.usuario)
  const pedidos = useStore((state) => state.pedidos)

  // Datos simulados para estadísticas de admin
  const totalUsuarios = 150
  const usuariosActivos = 145
  const pedidosPendientes = pedidos.filter((p) => p.estado === "pendiente").length
  const pedidosEnviados = pedidos.filter((p) => p.estado === "enviado").length
  const pedidosEntregados = pedidos.filter((p) => p.estado === "entregado").length
  const totalGanancias = pedidos.reduce((sum, p) => sum + p.total, 0)

  const estadisticas = [
    {
      titulo: "Total Usuarios",
      valor: totalUsuarios,
      icono: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      subtitulo: `${usuariosActivos} activos`,
    },
    {
      titulo: "Pedidos Pendientes",
      valor: pedidosPendientes,
      icono: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      subtitulo: "Requieren atención",
    },
    {
      titulo: "Pedidos Completados",
      valor: pedidosEntregados,
      icono: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      subtitulo: "Hoy y últimos 7 días",
    },
    {
      titulo: "Ingresos Totales",
      valor: `$${totalGanancias.toLocaleString("es-MX")}`,
      icono: TrendingUp,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
      subtitulo: "Valor acumulado",
    },
  ]

  return (
    <DashboardLayout title="Panel de Administración">
      <div className="flex flex-col gap-6">
        {/* Saludo */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-balance">
            Bienvenido, {usuario.nombre.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground">
            Gestión completa del sistema de cartillas.
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
          {/* Gestión rápida */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Gestión Rápida</CardTitle>
              <CardDescription>Acceso a las funciones administrativas principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button asChild className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/admin/usuarios">
                    <div className="flex w-full items-center gap-3">
                      <Users className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Gestionar Usuarios</p>
                        <p className="text-xs text-primary-foreground/70">
                          Ver, crear y editar usuarios
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/admin/pedidos">
                    <div className="flex w-full items-center gap-3">
                      <Package className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Gestionar Pedidos</p>
                        <p className="text-xs text-muted-foreground">
                          {pedidosPendientes} pendientes
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/admin/reportes">
                    <div className="flex w-full items-center gap-3">
                      <BarChart3 className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Reportes</p>
                        <p className="text-xs text-muted-foreground">
                          Análisis y estadísticas
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>

                <Button asChild variant="outline" className="h-auto flex-col items-start gap-2 p-4">
                  <Link href="/admin/configuracion">
                    <div className="flex w-full items-center gap-3">
                      <AlertCircle className="size-5" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">Configuración</p>
                        <p className="text-xs text-muted-foreground">
                          Ajustes del sistema
                        </p>
                      </div>
                      <ArrowRight className="size-4" />
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="size-5 text-amber-500" />
                Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {pedidosPendientes > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm font-medium text-amber-900">{pedidosPendientes} Pedidos Pendientes</p>
                  <p className="text-xs text-amber-800 mt-1">Requieren revisión y procesamiento</p>
                </div>
              )}
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-sm font-medium text-green-900">Sistema Operativo</p>
                <p className="text-xs text-green-800 mt-1">Todas las funciones disponibles</p>
              </div>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm font-medium text-blue-900">{usuariosActivos} Usuarios Activos</p>
                <p className="text-xs text-blue-800 mt-1">Conectados en las últimas 24h</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pedidos recientes para procesar */}
        {pedidosPendientes > 0 && (
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Pedidos por Procesar</CardTitle>
                <CardDescription>Últimos pedidos en estado pendiente</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/pedidos">
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

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminPageContent />
    </AuthGuard>
  )
}
