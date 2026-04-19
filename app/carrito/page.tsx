"use client"

import { useState, useRef } from "react"
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
  Upload,
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import { useStore } from "@/lib/store"
import { usePedidos } from "@/lib/hooks/usePedidos"
import { useDatosBancarios } from "@/lib/hooks/useDatosBancarios"

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
  console.log('[ListaCarrito] Render, carrito:', carrito);
  
  const handleMenos = (id: string, cantidad: number) => {
    console.log('[ListaCarrito] Menos clicked, id:', id, 'cantidad:', cantidad);
    const nuevaCantidad = cantidad - 1;
    actualizar(id, nuevaCantidad);
  };
  
  const handleMas = (id: string, cantidad: number) => {
    console.log('[ListaCarrito] Mas clicked, id:', id, 'cantidad:', cantidad);
    const nuevaCantidad = cantidad + 1;
    actualizar(id, nuevaCantidad);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artículos</CardTitle>
        <CardDescription>Productos seleccionados</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {carrito.map((item: any, index: number) => (
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
                    <Button onClick={() => handleMenos(item.cartilla.id, item.cantidad)}>
                      <Minus />
                    </Button>

                    <span>{Number(item.cantidad) || 1}</span>

                    <Button onClick={() => handleMas(item.cartilla.id, item.cantidad)}>
                      <Plus />
                    </Button>
                  </div>

                  <span>${(item.cartilla.precio || 0) * (Number(item.cantidad) || 1)}</span>
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

function MetodoPago({ metodo, setMetodo, onProcesar, loading, datosBancarios, comprobante, setComprobante }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Método de pago</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <RadioGroup value={metodo} onValueChange={setMetodo}>
          {metodosPago.map(m => (
            <div key={m.id} className="flex gap-2">
              <RadioGroupItem value={m.id} />
              <Label>{m.nombre}</Label>
            </div>
          ))}
        </RadioGroup>

        {metodo === "TRANSFERENCIA" && datosBancarios && (
          <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
            <h4 className="font-semibold text-sm">Datos para transferencia</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Banco:</span>
              <span>{datosBancarios.nombreBanco}</span>
              <span className="text-muted-foreground">Titular:</span>
              <span>{datosBancarios.titular}</span>
              <span className="text-muted-foreground">Alias:</span>
              <span>{datosBancarios.alias}</span>
              <span className="text-muted-foreground">Cuenta:</span>
              <span>{datosBancarios.numeroCuenta}</span>
              <span className="text-muted-foreground">CBU:</span>
              <span className="font-mono text-xs">{datosBancarios.cbu}</span>
            </div>

            <Separator className="my-3" />

            <div className="space-y-2">
              <Label htmlFor="comprobante">Comprobante de transferencia</Label>
              <Input
                id="comprobante"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setComprobante(file);
                }}
              />
              {comprobante && (
                <p className="text-xs text-green-600">
                  ✓ {comprobante.name}
                </p>
              )}
            </div>
          </div>
        )}

        {metodo === "TRANSFERENCIA" && !datosBancarios && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              No hay datos bancarios activos. Contacta al administrador.
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={onProcesar} 
          disabled={loading || (metodo === "TRANSFERENCIA" && !comprobante)} 
          className="w-full"
        >
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
  const { datos, loading: loadingDatos } = useDatosBancarios()

  const usuario = useStore(s => s.usuario)
  const token = useStore(s => s.token)
  const carrito = useStore(s => s.carrito)
  const eliminar = useStore(s => s.eliminarDelCarrito)
  const actualizar = useStore(s => s.actualizarCantidad)
  const total = useStore(s => s.getTotalCarrito)()

  const [metodo, setMetodo] = useState("TRANSFERENCIA")
  const [confirmado, setConfirmado] = useState(false)
  const [comprobante, setComprobante] = useState<File | null>(null)

  const procesar = async () => {
    const pedido = await crearPedido(metodo);
    if (!pedido) return;

    if (metodo === "TRANSFERENCIA" && comprobante && pedido) {
      try {
        const formData = new FormData();
        formData.append("file", comprobante);
        formData.append("pedidoId", pedido.id);
        formData.append("numeroOrden", pedido.numeroOrden);
        formData.append("monto", pedido.precio_total.toString());
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333"}/pagos/upload-comprobante`, {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        
        if (!res.ok) throw new Error("Error al subir comprobante");
      } catch (err) {
        console.error("Error uploading comprobante:", err);
        toast.warning("Pedido creado. Puedes subir el comprobante desde Mis Pedidos.");
      }
    }

    toast.success("Pedido creado correctamente");
    router.push("/pedidos");
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
            <MetodoPago 
              metodo={metodo} 
              setMetodo={setMetodo} 
              onProcesar={procesar} 
              loading={isLoading}
              datosBancarios={datos}
              comprobante={comprobante}
              setComprobante={setComprobante}
            />
          </div>
        </div>
      )}

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