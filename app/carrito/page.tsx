"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Banknote,
  Building,
  CheckCircle,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

import { useStore } from "@/lib/store"
import { usePedidos } from "@/lib/hooks/usePedidos"

const metodosPago = [
  { id: "TRANSFERENCIA", nombre: "Transferencia Bancaria", descripcion: "Pago electrónico", icono: Building },
  { id: "EFECTIVO", nombre: "Efectivo", descripcion: "Pago al recibir", icono: Banknote },
]

/* =========================
   COMPONENTES PEQUEÑOS
========================= */

function CarritoVacio() {
  return (
    <Card className="py-16">
      <CardContent className="flex flex-col items-center gap-6 text-center">
        <ShoppingCart className="size-10 text-muted-foreground" />
        <div>
          <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
          <p className="text-muted-foreground">Agrega productos para comenzar</p>
        </div>
        <Button asChild>
          <Link href="/catalogo">
            Ir al catálogo <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function ListaCarrito({ carrito, eliminar, actualizar }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Artículos</CardTitle>
        <CardDescription>Productos seleccionados</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {carrito.map((item, index) => (
          <div key={item.cartilla.id}>
            {index > 0 && <Separator />}
            <div className="flex gap-4">
              <img src={item.cartilla.imagen} className="size-24 rounded-lg object-cover" />

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex justify-between">
                  <div>
                    <Badge>{item.cartilla.materia}</Badge>
                    <h3>{item.cartilla.titulo}</h3>
                  </div>

                  <Button variant="ghost" onClick={() => eliminar(item.cartilla.id)}>
                    <Trash2 />
                  </Button>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button onClick={() => actualizar(item.cartilla.id, item.cantidad - 1)}>
                      <Minus />
                    </Button>

                    <span>{item.cantidad}</span>

                    <Button onClick={() => actualizar(item.cartilla.id, item.cantidad + 1)}>
                      <Plus />
                    </Button>
                  </div>

                  <span>${item.cartilla.precio * item.cantidad}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ResumenPedido({ carrito, total }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {carrito.map(item => (
          <div key={item.cartilla.id} className="flex justify-between text-sm">
            <span>{item.cartilla.titulo} x{item.cantidad}</span>
            <span>${item.cartilla.precio * item.cantidad}</span>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function MetodoPago({ metodo, setMetodo, onProcesar, loading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de pago</CardTitle>
      </CardHeader>

      <CardContent>
        <RadioGroup value={metodo} onValueChange={setMetodo}>
          {metodosPago.map(m => (
            <div key={m.id} className="flex gap-2">
              <RadioGroupItem value={m.id} />
              <Label>{m.nombre}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>

      <CardFooter>
        <Button onClick={onProcesar} disabled={loading} className="w-full">
          {loading ? <Loader2 className="animate-spin" /> : "Procesar Pedido"}
        </Button>
      </CardFooter>
    </Card>
  )
}

/* =========================
   MAIN
========================= */

function CarritoPageContent() {
  const router = useRouter()
  const { crearPedido, isLoading } = usePedidos()

  const carrito = useStore(s => s.carrito)
  const eliminar = useStore(s => s.eliminarDelCarrito)
  const actualizar = useStore(s => s.actualizarCantidad)
  const total = useStore(s => s.getTotalCarrito)()

  const [metodo, setMetodo] = useState("TRANSFERENCIA")
  const [confirmado, setConfirmado] = useState(false)

  const procesar = async () => {
    const pedido = await crearPedido(metodo)
    if (pedido) setConfirmado(true)
  }

  return (
    <DashboardLayout title="Carrito">

      {carrito.length === 0 ? (
        <CarritoVacio />
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ListaCarrito carrito={carrito} eliminar={eliminar} actualizar={actualizar} />
          </div>

          <div className="flex flex-col gap-4">
            <ResumenPedido carrito={carrito} total={total} />
            <MetodoPago metodo={metodo} setMetodo={setMetodo} onProcesar={procesar} loading={isLoading} />
          </div>
        </div>
      )}

      <Dialog open={confirmado}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pedido confirmado</DialogTitle>
            <DialogDescription>Todo salió bien</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => router.push("/pedidos")}>
              Ir a pedidos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  )
}

export default function CarritoPage() {
  return (
    <AuthGuard>
      <CarritoPageContent />
    </AuthGuard>
  )
}