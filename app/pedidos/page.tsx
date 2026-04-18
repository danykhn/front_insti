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
import { useStore, type Pedido } from "@/lib/store"

const estadoConfig: Record<
  Pedido["estado"],
  { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  pagado: {
    label: "Pagado",
    icon: CreditCard,
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  enviado: {
    label: "Enviado",
    icon: Truck,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  entregado: {
    label: "Entregado",
    icon: CheckCircle,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
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

  const pedidos = useStore((state) => state.pedidos)

  const pedidosFiltrados = useMemo(() => {
    let resultado = [...pedidos]

    if (busqueda) {
      const searchLower = busqueda.toLowerCase()
      resultado = resultado.filter(
        (p) =>
          p.id.toLowerCase().includes(searchLower) ||
          p.items.some((item) =>
            item.cartilla.titulo.toLowerCase().includes(searchLower)
          )
      )
    }

    if (estadoFiltro !== "todos") {
      resultado = resultado.filter((p) => p.estado === estadoFiltro)
    }

    return resultado.sort(
      (a, b) =>
        new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    )
  }, [pedidos, busqueda, estadoFiltro])

  const resumen = useMemo(() => {
    return {
      total: pedidos.length,
      pendientes: pedidos.filter((p) => p.estado === "pendiente").length,
      enviados: pedidos.filter((p) => p.estado === "enviado").length,
      entregados: pedidos.filter((p) => p.estado === "entregado").length,
    }
  }, [pedidos])

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
                <p className="text-2xl font-bold">{resumen.total}</p>
                <p className="text-sm text-muted-foreground">Total Pedidos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex size-12 items-center justify-center rounded-lg ${estadoConfig.pendiente.bgColor}`}>
                <Clock className={`size-6 ${estadoConfig.pendiente.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{resumen.pendientes}</p>
                <p className="text-sm text-muted-foreground">Pendientes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex size-12 items-center justify-center rounded-lg ${estadoConfig.enviado.bgColor}`}>
                <Truck className={`size-6 ${estadoConfig.enviado.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{resumen.enviados}</p>
                <p className="text-sm text-muted-foreground">En Camino</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex size-12 items-center justify-center rounded-lg ${estadoConfig.entregado.bgColor}`}>
                <CheckCircle className={`size-6 ${estadoConfig.entregado.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{resumen.entregados}</p>
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
                                {formatFecha(pedido.fechaCreacion)} -{" "}
                                {pedido.items.length} artículo
                                {pedido.items.length !== 1 ? "s" : ""}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">
                                ${pedido.total.toLocaleString("es-MX")}
                              </p>
                              {pedido.metodoPago && (
                                <p className="text-xs text-muted-foreground">
                                  {pedido.metodoPago}
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
                              <span>{formatFechaHora(pedido.fechaCreacion)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">
                                Última actualización:
                              </span>
                              <span>{formatFechaHora(pedido.fechaActualizacion)}</span>
                            </div>
                          </div>

                          {/* Productos */}
                          <div className="flex flex-col gap-3">
                            <h4 className="font-medium">Productos</h4>
                            {pedido.items.map((item) => (
                              <div
                                key={item.cartilla.id}
                                className="flex items-center gap-4 rounded-lg border p-3"
                              >
                                <div className="size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                                  <img
                                    src={item.cartilla.imagen}
                                    alt={item.cartilla.titulo}
                                    className="size-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{item.cartilla.titulo}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.cartilla.materia} - Cantidad: {item.cantidad}
                                  </p>
                                </div>
                                <p className="font-medium">
                                  ${(item.cartilla.precio * item.cantidad).toLocaleString("es-MX")}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Resumen */}
                          <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                            <span className="font-medium">Total del pedido</span>
                            <span className="text-xl font-bold text-primary">
                              ${pedido.total.toLocaleString("es-MX")}
                            </span>
                          </div>
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
