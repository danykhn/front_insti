"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useUserPedidos } from "@/lib/hooks/useUserPedidos"

const estadoConfig: Record<string, { label: string; icon: React.ElementType; color: string; bgColor: string }> = {
  PENDIENTE: {
    label: "Pendiente",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  PAGADO: {
    label: "Pagado",
    icon: CreditCard,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  COMPLETADO: {
    label: "Entregado",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  CANCELADO: {
    label: "Cancelado",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
  },
}

function formatFecha(fechaISO: string) {
  const fecha = new Date(fechaISO)
  return fecha.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatFechaHora(fechaISO: string) {
  const fecha = new Date(fechaISO)
  return fecha.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function PedidosPageContent() {
  const [busqueda, setBusqueda] = useState("")
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos")
  const [pedidoExpandido, setPedidoExpandido] = useState<string | null>(null)

  // Get real data from API
  const { 
    pedidos, 
    loading, 
    error, 
    total, 
    pendientes, 
    enCamino, 
    completados,
    recargar 
  } = useUserPedidos()

  const pedidosFiltrados = useMemo(() => {
    let resultado = [...(pedidos || [])]

    if (busqueda) {
      const searchLower = busqueda.toLowerCase()
      resultado = resultado.filter(
        (p: any) =>
          p.id?.toLowerCase().includes(searchLower) ||
          p.numeroOrden?.toLowerCase().includes(searchLower) ||
          (p.articulos as any[])?.some((item: any) =>
            item.titulo?.toLowerCase().includes(searchLower)
          )
      )
    }

    if (estadoFiltro !== "todos") {
      resultado = resultado.filter((p: any) => p.estado === estadoFiltro)
    }

    return resultado.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [pedidos, busqueda, estadoFiltro])

  const resumen = { total, pendientes, enCamino, completados }

  return (
    <DashboardLayout title="Mis Pedidos" breadcrumbs={[{ label: "Mis Pedidos" }]}>
      <div className="flex flex-col gap-6">
        {/* Encabezado */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Mis Pedidos</h1>
          <p className="text-muted-foreground">
            Gestiona y da seguimiento a todos tus pedidos
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                <Package className="size-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{total}</p>
                <p className="text-sm text-muted-foreground">Total Pedidos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex size-12 items-center justify-center rounded-lg ${estadoConfig['PENDIENTE'].bgColor}`}>
                <Clock className={`size-6 ${estadoConfig['PENDIENTE'].color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendientes}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex size-12 items-center justify-center rounded-lg ${estadoConfig['PAGADO'].bgColor}`}>
                <Truck className={`size-6 ${estadoConfig['PAGADO'].color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{enCamino}</p>
                <p className="text-sm text-muted-foreground">En Camino</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex size-12 items-center justify-center rounded-lg ${estadoConfig['COMPLETADO'].bgColor}`}>
                <CheckCircle className={`size-6 ${estadoConfig['COMPLETADO'].color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{completados}</p>
                <p className="text-sm text-muted-foreground">Entregados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar pedidos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="pagado">Pagados</SelectItem>
                  <SelectItem value="enviado">Enviados</SelectItem>
                  <SelectItem value="entregado">Entregados</SelectItem>
                  <SelectItem value="cancelado">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de pedidos */}
        {pedidosFiltrados.length > 0 ? (
          <div className="flex flex-col gap-4">
            {pedidosFiltrados.map((pedido) => {
              const config = estadoConfig[pedido.estado]
              const IconoEstado = config.icon
              const isExpanded = pedidoExpandido === pedido.id

              return (
                <Card key={pedido.id} className="overflow-hidden">
                  <Collapsible
                    open={isExpanded}
                    onOpenChange={() =>
                      setPedidoExpandido(isExpanded ? null : pedido.id)
                    }
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex size-12 items-center justify-center rounded-lg ${config.bgColor}`}>
                              <IconoEstado className={`size-6 ${config.color}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-base">
                                  Pedido #{pedido.id.split("_")[1]}
                                </CardTitle>
                                <Badge
                                  variant="secondary"
                                  className={`${config.bgColor} ${config.color} border-0`}
                                >
                                  {config.label}
                                </Badge>
                              </div>
                              <CardDescription>
                                {formatFecha(pedido.createdAt)} -{" "}
                                {(pedido.cartillas?.length || pedido.articulos?.length || pedido.cantidad_total || 0)} artículo(s)
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                ${(pedido.precio_total || pedido.total || 0).toLocaleString("es-MX")}
                              </p>
                              {pedido.metodo_pago && (
                                <p className="text-xs text-muted-foreground">
                                  {pedido.metodo_pago}
                                </p>
                              )}
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="size-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="size-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="border-t pt-6">
                        <div className="flex flex-col gap-6">
                          {/* Timeline */}
                          <div className="flex flex-col gap-2">
                            <h4 className="font-medium">Estado del pedido</h4>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">Creado:</span>
                              <span>{formatFechaHora(pedido.createdAt)}</span>
                            </div>
                            {pedido.updatedAt && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Última actualización:</span>
                                <span>{formatFechaHora(pedido.updatedAt)}</span>
                              </div>
                            )}
                          </div>

{/* Productos */}
                          <div className="flex flex-col gap-3">
                            <h4 className="font-medium">Productos del pedido</h4>
                            {(pedido.cartillas || pedido.articulos || []).map((item: any, idx: number) => (
                              <div
                                key={item.cartillaId || item.id || idx}
                                className="flex items-center gap-4 rounded-lg border p-3"
                              >
                                <div className="size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                                  <img
                                    src={item.cartilla?.imagen || item.imagen || '/placeholder.svg'}
                                    alt={item.cartilla?.titulo || 'Producto'}
                                    className="size-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.cartilla?.titulo || item.titulo || 'Cartilla'}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Materia: {item.cartilla?.materia || item.materia || 'N/A'}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Autor: {item.cartilla?.autor || item.autor || 'N/A'}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Carrera: {item.cartilla?.carrera || item.carrera || 'N/A'}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Cantidad: {item.cantidad}</p>
                                  <p className="font-medium">
                                    ${(item.precio_unitario || item.cartilla?.precio || item.precio || 0) * item.cantidad}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Resumen */}
                          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                            <span className="font-medium">Total del pedido</span>
                            <span className="text-xl font-bold text-primary">
                              ${(pedido.precio_total || pedido.total || 0).toLocaleString("es-MX")}
                            </span>
                          </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center gap-6 text-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                <Package className="size-10 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">No hay pedidos</h2>
                <p className="text-muted-foreground">
                  {busqueda || estadoFiltro !== "todos"
                    ? "No se encontraron pedidos con los filtros seleccionados"
                    : "Aún no has realizado ningún pedido"}
                </p>
              </div>
              {busqueda || estadoFiltro !== "todos" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setBusqueda("")
                    setEstadoFiltro("todos")
                  }}
                >
                  Limpiar filtros
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/catalogo">Explorar Catálogo</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function PedidosPage() {
  return (
    <AuthGuard>
      <PedidosPageContent />
    </AuthGuard>
  )
}
