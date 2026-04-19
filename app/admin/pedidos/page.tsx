"use client"

import {
  Package,
  Search,
  Eye,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Loader2,
  DollarSign,
  User,
  BookOpen,
  RefreshCw,
} from "lucide-react"
import { useEffect, useState, useCallback, useRef } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { AuthGuard } from "@/components/auth-guard"
import pedidosService, { Pedido, PedidoEstado, MetodoPago } from "@/lib/api/pedidosService"

function AdminPedidosContent() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  
  const [detailModal, setDetailModal] = useState<Pedido | null>(null)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const accessToken = useStore((state) => state.accessToken)
  const usuario = useStore((state) => state.usuario)
  const wsRef = useRef<any>(null)

  const initWebSocket = useCallback(async () => {
    if (!accessToken) return
    if (wsRef.current?.connected) return
    
    try {
      const socketIO = await import('socket.io-client')
      const io = (socketIO as any).io
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3333'
      const socket = io(wsUrl, {
        auth: { token: accessToken },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
      })
  
      socket.on('connect', () => {
        console.log('[WS] Conectado a WebSocket de pedidos')
        socket.emit('suscribirse_todos_pedidos')
      })
  
      socket.on('nuevo_pedido', (data: any) => {
        console.log('[WS] Nuevo pedido:', data)
        cargarPedidos()
        cargarStats()
      })
  
      socket.on('actualizar_pedido', (data: any) => {
        console.log('[WS] Actualizar pedido:', data)
        cargarPedidos()
        cargarStats()
      })
  
      socket.on('cambio_estado_pedido', (data: any) => {
        console.log('[WS] Cambio estado:', data)
        cargarPedidos()
        cargarStats()
      })
  
      wsRef.current = socket
    } catch (err) {
      console.error('[WS] Error al conectar:', err)
    }
  }, [accessToken, cargarPedidos, cargarStats])

  useEffect(() => {
    if (accessToken && (usuario.rol === 'ADMIN' || usuario.rol === 'EMPLEADO')) {
      initWebSocket()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.disconnect()
        wsRef.current = null
      }
    }
  }, [accessToken, usuario.rol, initWebSocket])

  useEffect(() => {
    if (accessToken) {
      pedidosService.setToken(accessToken)
    }
    cargarPedidos()
    cargarStats()
  }, [accessToken])

  function cargarPedidos() {
    setLoading(true)
    setError(null)
    pedidosService.getPedidos()
      .then(setPedidos)
      .catch(() => setError("No se pudieron cargar los pedidos"))
      .finally(() => setLoading(false))
  }

  function cargarStats() {
    pedidosService.getStats()
      .then(setStats)
      .catch(() => {})
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const usuarioNombre = `${pedido.usuario?.firstName || ''} ${pedido.usuario?.lastName || ''}`.toLowerCase()
    const matchSearch = 
      pedido.numeroOrden.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuarioNombre.includes(searchTerm.toLowerCase()) ||
      pedido.usuario?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = !selectedStatus || pedido.estado === selectedStatus
    return matchSearch && matchStatus
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "PENDIENTE": return "bg-amber-100 text-amber-800"
      case "PAGADO": return "bg-blue-100 text-blue-800"
      case "COMPLETADO": return "bg-green-100 text-green-800"
      case "CANCELADO": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case "PENDIENTE": return "Pendiente"
      case "PAGADO": return "Pagado"
      case "COMPLETADO": return "Completado"
      case "CANCELADO": return "Cancelado"
      default: return estado
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "PENDIENTE": return <Clock className="size-4" />
      case "PAGADO": return <DollarSign className="size-4" />
      case "COMPLETADO": return <CheckCircle className="size-4" />
      case "CANCELADO": return <XCircle className="size-4" />
      default: return <Package className="size-4" />
    }
  }

  const handleCambiarEstado = async (pedido: Pedido, nuevoEstado: PedidoEstado) => {
    if (!accessToken) return
    setActionLoading(pedido.id)
    try {
      await pedidosService.updateEstado(pedido.id, { estado: nuevoEstado })
      cargarPedidos()
      cargarStats()
      setDetailModal(null)
    } catch (err: any) {
      setError(err?.message || "No se pudo actualizar el estado")
    } finally {
      setActionLoading(null)
    }
  }

  if (usuario.rol !== "ADMIN" && usuario.rol !== "EMPLEADO") {
    return (
      <DashboardLayout title="Pedidos">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Solo administradores o empleados pueden acceder.</CardTitle>
          </CardHeader>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Pedidos" breadcrumbs={[{ label: "Administración" }, { label: "Pedidos" }]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra y monitorea todos los pedidos del sistema</p>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="size-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.totalPedidos || 0}</p>
                <p className="text-sm text-muted-foreground">Total Pedidos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="size-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pedidosPendientes || 0}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100">
                <DollarSign className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pedidosPagados || 0}</p>
                <p className="text-sm text-muted-foreground">Pagados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.pedidosCompletados || 0}</p>
                <p className="text-sm text-muted-foreground">Completados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">${((stats?.totalGanancias || 0)).toLocaleString("es-MX")}</p>
                <p className="text-sm text-muted-foreground">Ingresos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="Buscar por ID, cliente o email..."
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
                variant={selectedStatus === "PENDIENTE" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("PENDIENTE")}
              >
                Pendientes
              </Button>
              <Button
                variant={selectedStatus === "PAGADO" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("PAGADO")}
              >
                Pagados
              </Button>
              <Button
                variant={selectedStatus === "COMPLETADO" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("COMPLETADO")}
              >
                Completados
              </Button>
              <Button
                variant={selectedStatus === "CANCELADO" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("CANCELADO")}
              >
                Cancelados
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
            {loading ? (
              <div className="py-6 flex items-center gap-3"><Loader2 className="animate-spin size-5" /> Cargando...</div>
            ) : error ? (
              <div className="text-destructive py-6">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Orden</th>
                      <th className="text-left py-3 px-4 font-medium">Cliente</th>
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
                        <td className="py-3 px-4 font-medium">#{pedido.numeroOrden}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="size-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {pedido.usuario?.firstName} {pedido.usuario?.lastName}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {pedido.usuario?.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{pedido.cantidad_total} artículo(s)</td>
                        <td className="py-3 px-4 font-semibold">
                          ${pedido.precio_total.toLocaleString("es-MX")}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getEstadoColor(pedido.estado)}>
                            {getEstadoIcon(pedido.estado)}
                            <span className="ml-2">{getEstadoLabel(pedido.estado)}</span>
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(pedido.createdAt).toLocaleDateString("es-MX")}
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="sm" onClick={() => setDetailModal(pedido)}>
                            <Eye className="size-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Detalle Pedido */}
      {detailModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl border flex flex-col gap-4 my-8 mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">Pedido #{detailModal.numeroOrden}</h2>
                <p className="text-sm text-muted-foreground">
                  Creado el {new Date(detailModal.createdAt).toLocaleString("es-MX")}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDetailModal(null)}>
                X
              </Button>
            </div>

            {/* Info Cliente */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <User className="size-4" /> Datos del Cliente
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Nombre completo</Label>
                  <p className="font-medium">{detailModal.usuario?.firstName} {detailModal.usuario?.lastName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{detailModal.usuario?.email}</p>
                </div>
              </div>
            </div>

            {/* Artículos */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <BookOpen className="size-4" /> Artículos Pedidos
              </h3>
              <div className="space-y-3">
                {(detailModal.cartillas || detailModal.articulos)?.map((art: any, idx: number) => (
                  <div key={idx} className="flex gap-3 text-sm border-b pb-3 last:border-0">
                    <img 
                      src={art.cartilla?.imagen || art.cartilla?.imagen || "https://placehold.co/100x140?text=Book"} 
                      alt={art.cartilla?.titulo || art.titulo}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{art.cartilla?.titulo || art.titulo || `Cartilla ${art.cartillaId}`}</p>
                      <p className="text-xs text-muted-foreground">{art.cartilla?.materia}</p>
                      <p className="text-xs text-muted-foreground">Autor: {art.cartilla?.autor}</p>
                      <div className="flex justify-between mt-2">
                        <p className="text-xs">Cantidad: {art.cantidad}</p>
                        <p className="font-medium">${(art.subtotal || art.precio || 0).toLocaleString("es-MX")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-2 border-t">
                <p className="font-medium">Total</p>
                <p className="text-lg font-bold">${detailModal.precio_total.toLocaleString("es-MX")}</p>
              </div>
            </div>

            {/* Info Pago */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="size-4" /> Información de Pago
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Método de Pago</Label>
                  <p className="font-medium">{detailModal.metodo_pago}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Estado</Label>
                  <Badge className={getEstadoColor(detailModal.estado)}>
                    {getEstadoIcon(detailModal.estado)}
                    <span className="ml-2">{getEstadoLabel(detailModal.estado)}</span>
                  </Badge>
                </div>
              </div>
              {detailModal.observaciones && (
                <div className="mt-3">
                  <Label className="text-muted-foreground">Observaciones</Label>
                  <p className="text-sm">{detailModal.observaciones}</p>
                </div>
              )}
            </div>

            {/* Cambiar Estado */}
            {detailModal.estado !== "CANCELADO" && detailModal.estado !== "COMPLETADO" && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Cambiar Estado</h3>
                <div className="flex gap-2 flex-wrap">
                  {detailModal.estado === "PENDIENTE" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleCambiarEstado(detailModal, "PAGADO")}
                      disabled={actionLoading === detailModal.id}
                    >
                      {actionLoading === detailModal.id ? <Loader2 className="size-4 animate-spin" /> : "Marcar como Pagado"}
                    </Button>
                  )}
                  {detailModal.estado === "PAGADO" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleCambiarEstado(detailModal, "COMPLETADO")}
                      disabled={actionLoading === detailModal.id}
                    >
                      {actionLoading === detailModal.id ? <Loader2 className="size-4 animate-spin" /> : "Marcar como Completado"}
                    </Button>
                  )}
                  {(detailModal.estado !== "CANCELADO" as any) && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleCambiarEstado(detailModal, "CANCELADO")}
                      disabled={actionLoading === detailModal.id}
                    >
                      {actionLoading === detailModal.id ? <Loader2 className="size-4 animate-spin" /> : "Cancelar Pedido"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
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