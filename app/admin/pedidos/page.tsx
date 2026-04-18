"use client"

import {
  Package,
  Search,
  Eye,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react"
import { useState } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { AuthGuard } from "@/components/auth-guard"

function AdminPedidosContent() {
  const pedidos = useStore((state) => state.pedidos)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const matchSearch = pedido.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = !selectedStatus || pedido.estado === selectedStatus
    return matchSearch && matchStatus
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-amber-100 text-amber-800"
      case "pagado":
        return "bg-blue-100 text-blue-800"
      case "enviado":
        return "bg-purple-100 text-purple-800"
      case "entregado":
        return "bg-green-100 text-green-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Clock className="size-4" />
      case "pagado":
        return <CheckCircle className="size-4" />
      case "enviado":
        return <Truck className="size-4" />
      case "entregado":
        return <CheckCircle className="size-4" />
      default:
        return <Package className="size-4" />
    }
  }

  const estadisticas = [
    {
      label: "Total Pedidos",
      valor: pedidos.length,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Pendientes",
      valor: pedidos.filter(p => p.estado === "pendiente").length,
      color: "bg-amber-100 text-amber-800",
    },
    {
      label: "Pagados",
      valor: pedidos.filter(p => p.estado === "pagado").length,
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Entregados",
      valor: pedidos.filter(p => p.estado === "entregado").length,
      color: "bg-green-100 text-green-800",
    },
  ]

  return (
    <DashboardLayout
      title="Gestión de Pedidos"
      breadcrumbs={[{ label: "Administración" }, { label: "Pedidos" }]}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra y monitorea todos los pedidos del sistema</p>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {estadisticas.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`flex size-12 items-center justify-center rounded-lg ${stat.color}`}>
                  <Package className="size-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.valor}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="Buscar por ID de pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedStatus === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(null)}
              >
                Todos
              </Button>
              <Button
                variant={selectedStatus === "pendiente" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("pendiente")}
              >
                Pendientes
              </Button>
              <Button
                variant={selectedStatus === "pagado" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("pagado")}
              >
                Pagados
              </Button>
              <Button
                variant={selectedStatus === "enviado" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("enviado")}
              >
                Enviados
              </Button>
              <Button
                variant={selectedStatus === "entregado" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("entregado")}
              >
                Entregados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de pedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos ({pedidosFiltrados.length})</CardTitle>
            <CardDescription>Lista de todos los pedidos del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">ID Pedido</th>
                    <th className="text-left py-3 px-4 font-medium">Artículos</th>
                    <th className="text-left py-3 px-4 font-medium">Total</th>
                    <th className="text-left py-3 px-4 font-medium">Estado</th>
                    <th className="text-left py-3 px-4 font-medium">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosFiltrados.map((pedido) => (
                    <tr key={pedido.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">#{pedido.id.split("_")[1]}</td>
                      <td className="py-3 px-4">{pedido.items.length} artículo(s)</td>
                      <td className="py-3 px-4 font-semibold">
                        ${pedido.total.toLocaleString("es-MX")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Badge className={getEstadoColor(pedido.estado)}>
                            {getEstadoIcon(pedido.estado)}
                            <span className="ml-2">{pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}</span>
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(pedido.fechaCreacion).toLocaleDateString("es-MX")}
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function AdminPedidosPage() {
  return (
    <AuthGuard>
      <AdminPedidosContent />
    </AuthGuard>
  )
}
