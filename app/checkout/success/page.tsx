"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle, XCircle, Clock, Loader2, ArrowRight } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { authService } from "@/lib/auth/authService"
import pedidosService from "@/lib/api/pedidosService"

export default function CheckoutSuccessPage() {
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
      <DashboardLayout title="Procesando...">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Pago Exitoso">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Pago Exitoso!</CardTitle>
            <CardDescription>
              Tu pago fue procesado correctamente
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className="font-medium text-green-600">{pedido.estado}</span>
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
      </div>
    </DashboardLayout>
  )
}