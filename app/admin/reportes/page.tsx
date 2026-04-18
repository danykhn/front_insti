"use client"

import { BarChart3, TrendingUp, PieChart } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { AuthGuard } from "@/components/auth-guard"

function AdminReportesContent() {
  const pedidos = useStore((state) => state.pedidos)

  const totalIngresos = pedidos.reduce((sum, p) => sum + p.total, 0)
  const pedidosPorEstado = {
    pendiente: pedidos.filter(p => p.estado === "pendiente").length,
    pagado: pedidos.filter(p => p.estado === "pagado").length,
    enviado: pedidos.filter(p => p.estado === "enviado").length,
    entregado: pedidos.filter(p => p.estado === "entregado").length,
    cancelado: pedidos.filter(p => p.estado === "cancelado").length,
  }

  const reportes = [
    {
      titulo: "Ingresos Totales",
      valor: `$${totalIngresos.toLocaleString("es-MX")}`,
      icono: TrendingUp,
      color: "bg-green-100 text-green-600",
      descripcion: "Ganancias acumuladas",
    },
    {
      titulo: "Total de Pedidos",
      valor: pedidos.length,
      icono: BarChart3,
      color: "bg-blue-100 text-blue-600",
      descripcion: "Pedidos registrados",
    },
    {
      titulo: "Tasa de Entrega",
      valor: `${((pedidosPorEstado.entregado / pedidos.length) * 100).toFixed(1)}%`,
      icono: PieChart,
      color: "bg-purple-100 text-purple-600",
      descripcion: "Pedidos entregados",
    },
  ]

  return (
    <DashboardLayout
      title="Reportes"
      breadcrumbs={[{ label: "Administración" }, { label: "Reportes" }]}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Reportes y Análisis</h1>
          <p className="text-muted-foreground">Visualiza estadísticas y métricas del sistema</p>
        </div>

        {/* Tarjetas de reportes principales */}
        <div className="grid gap-4 sm:grid-cols-3">
          {reportes.map((reporte) => (
            <Card key={reporte.titulo}>
              <CardContent className="flex flex-col gap-4 pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{reporte.titulo}</p>
                    <p className="text-2xl font-bold mt-2">{reporte.valor}</p>
                  </div>
                  <div className={`flex size-12 items-center justify-center rounded-lg ${reporte.color}`}>
                    <reporte.icono className="size-6" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{reporte.descripcion}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desglose por estado */}
        <Card>
          <CardHeader>
            <CardTitle>Desglose de Pedidos por Estado</CardTitle>
            <CardDescription>Distribución de pedidos según su estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(pedidosPorEstado).map(([estado, cantidad]) => {
                const total = pedidos.length
                const porcentaje = ((cantidad / total) * 100).toFixed(1)
                const colores = {
                  pendiente: "bg-amber-500",
                  pagado: "bg-blue-500",
                  enviado: "bg-purple-500",
                  entregado: "bg-green-500",
                  cancelado: "bg-red-500",
                }
                return (
                  <div key={estado}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{estado}</span>
                      <span className="text-sm text-muted-foreground">{cantidad} ({porcentaje}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colores[estado as keyof typeof colores]}`}
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Período Actual</CardTitle>
            <CardDescription>Estadísticas del período actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Período</p>
                <p className="text-lg font-semibold">Enero 2025 - Abril 2025</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Ingresos en el período</p>
                <p className="text-lg font-semibold">${totalIngresos.toLocaleString("es-MX")}</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Promedio por pedido</p>
                <p className="text-lg font-semibold">
                  ${(totalIngresos / Math.max(pedidos.length, 1)).toLocaleString("es-MX")}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Pedidos completados</p>
                <p className="text-lg font-semibold">{pedidosPorEstado.entregado} de {pedidos.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function AdminReportesPage() {
  return (
    <AuthGuard>
      <AdminReportesContent />
    </AuthGuard>
  )
}
