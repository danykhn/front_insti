"use client"

import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Clock, Loader2, ArrowRight } from "lucide-react"

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
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-yellow-100">
          <Clock className="size-8 text-yellow-600" />
        </div>
        <CardTitle className="text-2xl">Pago Pendiente</CardTitle>
        <CardDescription>
          Tu pago está siendo procesado. Te notificaremos cuando sea confirmado.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pedido && (
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pedido:</span>
              <span className="font-medium">#{pedido.numeroOrden}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto:</span>
              <span className="font-medium">${pedido.precio_total}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button onClick={() => router.push("/pedidos")} className="w-full">
            Ver Mis Pedidos <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" onClick={() => router.push("/catalogo")} className="w-full">
            Continuar Comprando
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

export default function CheckoutPendingPage() {
  return (
    <DashboardLayout title="Pago Pendiente">
      <div className="max-w-md mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <CheckoutContent />
        </Suspense>
      </div>
    </DashboardLayout>
  )
}