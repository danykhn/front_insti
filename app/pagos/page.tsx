"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Calendar,
  Receipt,
  ArrowUpRight,
  TrendingUp,
  Banknote,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useStore, type Pago } from "@/lib/store"

const estadoPagoConfig: Record<
  Pago["estado"],
  { label: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    variant: "outline",
  },
  completado: {
    label: "Completado",
    icon: CheckCircle,
    variant: "default",
  },
  fallido: {
    label: "Fallido",
    icon: XCircle,
    variant: "destructive",
  },
  reembolsado: {
    label: "Reembolsado",
    icon: RefreshCw,
    variant: "secondary",
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

function PagosPageContent() {
  const [busqueda, setBusqueda] = useState("")
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos")
  const [metodoFiltro, setMetodoFiltro] = useState<string>("todos")

  const pagos = useStore((state) => state.pagos)
  const pedidos = useStore((state) => state.pedidos)

  const pagosFiltrados = useMemo(() => {
    let resultado = [...pagos]

    if (busqueda) {
      const searchLower = busqueda.toLowerCase()
      resultado = resultado.filter(
        (p) =>
          p.id.toLowerCase().includes(searchLower) ||
          p.referencia?.toLowerCase().includes(searchLower) ||
          p.pedidoId.toLowerCase().includes(searchLower)
      )
    }

    if (estadoFiltro !== "todos") {
      resultado = resultado.filter((p) => p.estado === estadoFiltro)
    }

    if (metodoFiltro !== "todos") {
      resultado = resultado.filter((p) => p.metodoPago.toLowerCase() === metodoFiltro)
    }

    return resultado.sort(
      (a, b) => new Date(b.fechaPago).getTime() - new Date(a.fechaPago).getTime()
    )
  }, [pagos, busqueda, estadoFiltro, metodoFiltro])

  const resumen = useMemo(() => {
    const completados = pagos.filter((p) => p.estado === "completado")
    const totalPagado = completados.reduce((acc, p) => acc + p.monto, 0)
    const pendientes = pagos.filter((p) => p.estado === "pendiente")
    const totalPendiente = pendientes.reduce((acc, p) => acc + p.monto, 0)

    return {
      totalPagado,
      totalPendiente,
      cantidadCompletados: completados.length,
      cantidadPendientes: pendientes.length,
    }
  }, [pagos])

  const metodosPago = useMemo(() => {
    return [...new Set(pagos.map((p) => p.metodoPago))]
  }, [pagos])

  const getPedidoInfo = (pedidoId: string) => {
    return pedidos.find((p) => p.id === pedidoId)
  }

  return (
    <DashboardLayout title="Pagos" breadcrumbs={[{ label: "Pagos" }]}>
      <div className="flex flex-col gap-6">
        {/* Encabezado */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Historial de Pagos</h1>
          <p className="text-muted-foreground">
            Consulta todas tus transacciones y pagos realizados
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-accent/10">
                <TrendingUp className="size-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent">
                  ${resumen.totalPagado.toLocaleString("es-MX")}
                </p>
                <p className="text-sm text-muted-foreground">Total Pagado</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-chart-4/10">
                <Clock className="size-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${resumen.totalPendiente.toLocaleString("es-MX")}
                </p>
                <p className="text-sm text-muted-foreground">Por Pagar</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resumen.cantidadCompletados}</p>
                <p className="text-sm text-muted-foreground">Pagos Completados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                <Receipt className="size-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pagos.length}</p>
                <p className="text-sm text-muted-foreground">Total Transacciones</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por referencia o pedido..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="completado">Completados</SelectItem>
                  <SelectItem value="fallido">Fallidos</SelectItem>
                  <SelectItem value="reembolsado">Reembolsados</SelectItem>
                </SelectContent>
              </Select>
              <Select value={metodoFiltro} onValueChange={setMetodoFiltro}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Método de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los métodos</SelectItem>
                  {metodosPago.map((metodo) => (
                    <SelectItem key={metodo} value={metodo.toLowerCase()}>
                      {metodo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de pagos */}
        {pagosFiltrados.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Transacciones</CardTitle>
              <CardDescription>
                {pagosFiltrados.length} transacción{pagosFiltrados.length !== 1 ? "es" : ""}{" "}
                encontrada{pagosFiltrados.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referencia</TableHead>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagosFiltrados.map((pago) => {
                      const config = estadoPagoConfig[pago.estado]
                      const IconoEstado = config.icon
                      const pedido = getPedidoInfo(pago.pedidoId)

                      return (
                        <TableRow key={pago.id}>
                          <TableCell className="font-mono text-sm">
                            {pago.referencia || "-"}
                          </TableCell>
                          <TableCell>
                            <Link
                              href="/pedidos"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              #{pago.pedidoId.split("_")[1]}
                              <ArrowUpRight className="size-3" />
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {pago.metodoPago.toLowerCase().includes("tarjeta") ? (
                                <CreditCard className="size-4 text-muted-foreground" />
                              ) : (
                                <Banknote className="size-4 text-muted-foreground" />
                              )}
                              {pago.metodoPago}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="size-4 text-muted-foreground" />
                              {formatFecha(pago.fechaPago)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={config.variant} className="gap-1">
                              <IconoEstado className="size-3" />
                              {config.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${pago.monto.toLocaleString("es-MX")}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center gap-6 text-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-muted">
                <CreditCard className="size-10 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">No hay transacciones</h2>
                <p className="text-muted-foreground">
                  {busqueda || estadoFiltro !== "todos" || metodoFiltro !== "todos"
                    ? "No se encontraron transacciones con los filtros seleccionados"
                    : "Aún no has realizado ningún pago"}
                </p>
              </div>
              {busqueda || estadoFiltro !== "todos" || metodoFiltro !== "todos" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setBusqueda("")
                    setEstadoFiltro("todos")
                    setMetodoFiltro("todos")
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

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-5" />
              Información de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-medium">Transferencia Bancaria</h4>
                <p className="text-sm text-muted-foreground">
                  Realiza tu pago por transferencia y envía el comprobante para
                  confirmar tu pedido.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-medium">Pago en Efectivo</h4>
                <p className="text-sm text-muted-foreground">
                  Paga al momento de recibir tu pedido. El repartidor te
                  entregará un recibo.
                </p>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-medium">Tarjeta de Crédito/Débito</h4>
                <p className="text-sm text-muted-foreground">
                  Pago seguro con tarjeta. Tu información está protegida.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function PagosPage() {
  return (
    <AuthGuard>
      <PagosPageContent />
    </AuthGuard>
  )
}
