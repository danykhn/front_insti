"use client"

import { useState } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  GraduationCap,
  Edit,
  Save,
  X,
  Camera,
  Package,
  CreditCard,
  ShoppingCart,
} from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"

function PerfilPageContent() {
  const usuario = useStore((state) => state.usuario)
  const setUsuario = useStore((state) => state.setUsuario)
  const pedidos = useStore((state) => state.pedidos)
  const pagos = useStore((state) => state.pagos)

  const [editando, setEditando] = useState(false)
  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    email: usuario.email,
    telefono: usuario.telefono,
    direccion: usuario.direccion,
    grado: usuario.grado,
    institucion: usuario.institucion,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGuardar = () => {
    setUsuario({
      ...usuario,
      ...formData,
    })
    setEditando(false)
  }

  const handleCancelar = () => {
    setFormData({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      grado: usuario.grado,
      institucion: usuario.institucion,
    })
    setEditando(false)
  }

  const estadisticas = [
    {
      label: "Pedidos Realizados",
      valor: pedidos.length,
      icono: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Pagos Completados",
      valor: pagos.filter((p) => p.estado === "completado").length,
      icono: CreditCard,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Total Gastado",
      valor: `$${pagos
        .filter((p) => p.estado === "completado")
        .reduce((acc, p) => acc + p.monto, 0)
        .toLocaleString("es-MX")}`,
      icono: ShoppingCart,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  return (
    <DashboardLayout title="Mi Perfil" breadcrumbs={[{ label: "Mi Perfil" }]}>
      <div className="flex flex-col gap-6">
        {/* Encabezado */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Administra tu información personal y preferencias
          </p>
        </div>

        {/* Tarjeta de perfil */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Información principal */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Datos de tu cuenta de estudiante
                </CardDescription>
              </div>
              {!editando ? (
                <Button variant="outline" size="sm" onClick={() => setEditando(true)}>
                  <Edit className="size-4" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelar}>
                    <X className="size-4" />
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleGuardar}>
                    <Save className="size-4" />
                    Guardar
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Avatar y nombre */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="size-20">
                      <AvatarImage src={usuario.avatar} alt={usuario.nombre} />
                      <AvatarFallback className="text-xl">
                        {usuario.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    {editando && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-1 -right-1 size-8 rounded-full"
                      >
                        <Camera className="size-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    {editando ? (
                      <div className="flex flex-col gap-1">
                        <Label htmlFor="nombre">Nombre completo</Label>
                        <Input
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          className="max-w-xs"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold">{usuario.nombre}</h2>
                        <p className="text-muted-foreground">{usuario.grado}</p>
                      </>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Campos de información */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Mail className="size-4" />
                      Correo Electrónico
                    </Label>
                    {editando ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="font-medium">{usuario.email}</p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="telefono"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Phone className="size-4" />
                      Teléfono
                    </Label>
                    {editando ? (
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="font-medium">{usuario.telefono}</p>
                    )}
                  </div>

                  {/* Grado */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="grado"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <GraduationCap className="size-4" />
                      Grado Escolar
                    </Label>
                    {editando ? (
                      <Input
                        id="grado"
                        name="grado"
                        value={formData.grado}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="font-medium">{usuario.grado}</p>
                    )}
                  </div>

                  {/* Institución */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="institucion"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Building className="size-4" />
                      Institución
                    </Label>
                    {editando ? (
                      <Input
                        id="institucion"
                        name="institucion"
                        value={formData.institucion}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="font-medium">{usuario.institucion}</p>
                    )}
                  </div>

                  {/* Dirección */}
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label
                      htmlFor="direccion"
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <MapPin className="size-4" />
                      Dirección de Entrega
                    </Label>
                    {editando ? (
                      <Textarea
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        rows={2}
                      />
                    ) : (
                      <p className="font-medium">{usuario.direccion}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas del usuario */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tu Actividad</CardTitle>
                <CardDescription>Resumen de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {estadisticas.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-4 rounded-lg border p-4"
                  >
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg ${stat.bgColor}`}
                    >
                      <stat.icono className={`size-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{stat.valor}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Información de cuenta */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Cuenta</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ID de Usuario</span>
                  <span className="font-mono">{usuario.id}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <span className="flex items-center gap-2 text-accent">
                    <span className="size-2 rounded-full bg-accent" />
                    Activo
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tipo de Cuenta</span>
                  <span>Estudiante</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Configuración adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Preferencias</CardTitle>
            <CardDescription>
              Personaliza tu experiencia en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Notificaciones por Email</p>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones de pedidos
                  </p>
                </div>
                <div className="flex size-6 items-center justify-center rounded-full bg-accent">
                  <span className="text-xs text-white">On</span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Recordatorios</p>
                  <p className="text-sm text-muted-foreground">
                    Alertas de nuevas cartillas
                  </p>
                </div>
                <div className="flex size-6 items-center justify-center rounded-full bg-accent">
                  <span className="text-xs text-white">On</span>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Promociones</p>
                  <p className="text-sm text-muted-foreground">
                    Ofertas y descuentos
                  </p>
                </div>
                <div className="flex size-6 items-center justify-center rounded-full bg-muted">
                  <span className="text-xs">Off</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function PerfilPage() {
  return (
    <AuthGuard>
      <PerfilPageContent />
    </AuthGuard>
  )
}
