"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { XCircle, Loader2, ArrowRight, AlertTriangle } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import authService from "@/lib/auth/authService"
import pedidosService from "@/lib/api/pedidosService"
import { Skeleton } from "@/components/ui/skeleton"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pedidoId = searchParams.get("pedido")
  
  const [loading, setLoading] = useState(true)
  const [pedido, setPedido] = useState<any>(null)

  useEffect(() => {
    if (pedidoId) {
      const token = authService.getToken()
      if (token) {
        pedidosService.setToken(token)
      }
      
      pedidosService.getPedido(pedidoId)
        .then(setPedido)
        .catch(console.error)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [pedidoId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="size-8 text-red-600" />
        </div>
        <CardTitle className="text-2xl">Pago Rechazado</CardTitle>
        <CardDescription>
          El pago no pudo ser procesado. Por favor, intenta nuevamente o usa otro método de pago.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pedido && (
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pedido:</span>
              <span className="font-medium">#{pedido.numeroOrden}</span>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex gap-2 text-yellow-800">
            <AlertTriangle className="size-5 shrink-0" />
            <p className="text-sm">
              Si el cargo fue realizado en tu tarjeta, contacta a tu banco para más información.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={() => router.push("/carrito")} className="w-full">
            Intentar Nuevo Pago <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" onClick={() => router.push("/pedidos")} className="w-full">
            Ver Mis Pedidos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingFallback() {
  return (
    <Card>
      <CardHeader className="text-center">
        <Skeleton className="mx-auto mb-4 size-16 rounded-full" />
        <Skeleton className="mx-auto h-8 w-48" />
        <Skeleton className="mx-auto h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  )
}

export default function CheckoutFailurePage() {
  return (
    <DashboardLayout title="Pago Rechazado">
      <div className="max-w-md mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <CheckoutContent />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}