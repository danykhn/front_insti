"use client"

import { Settings, Save, ToggleLeft, Database, Shield, Mail } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"

function AdminConfiguracionContent() {
  const configuraciones = [
    {
      titulo: "Seguridad",
      descripcion: "Configurar políticas de seguridad del sistema",
      icono: Shield,
      opciones: [
        { label: "Requerir autenticación de dos factores", activo: true },
        { label: "Bloquear cuenta después de 5 intentos fallidos", activo: true },
        { label: "Expiración de sesión automática", activo: false },
      ],
    },
    {
      titulo: "Notificaciones",
      descripcion: "Configurar notificaciones del sistema",
      icono: Mail,
      opciones: [
        { label: "Notificaciones de nuevos pedidos", activo: true },
        { label: "Alertas de errores del sistema", activo: true },
        { label: "Reportes semanales", activo: false },
      ],
    },
    {
      titulo: "Base de Datos",
      descripcion: "Configurar y mantener la base de datos",
      icono: Database,
      opciones: [
        { label: "Hacer backup automático", activo: true },
        { label: "Limpiar datos antiguos", activo: false },
        { label: "Optimizar índices", activo: true },
      ],
    },
  ]

  return (
    <DashboardLayout
      title="Configuración"
      breadcrumbs={[{ label: "Administración" }, { label: "Configuración" }]}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
          <p className="text-muted-foreground">Administra la configuración general de la plataforma</p>
        </div>

        {/* Secciones de configuración */}
        {configuraciones.map((seccion) => (
          <Card key={seccion.titulo}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <seccion.icono className="size-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle>{seccion.titulo}</CardTitle>
                  <CardDescription>{seccion.descripcion}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seccion.opciones.map((opcion) => (
                  <div key={opcion.label} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50">
                    <span className="font-medium text-sm">{opcion.label}</span>
                    <button
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        opcion.activo ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          opcion.activo ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Información del sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>Detalles técnicos de la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Versión</p>
                <p className="font-semibold">1.0.0</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Base de Datos</p>
                <p className="font-semibold">PostgreSQL</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Último backup</p>
                <p className="font-semibold">2025-04-17 14:30</p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Usuarios en línea</p>
                <p className="font-semibold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button className="gap-2">
            <Save className="size-4" />
            Guardar Cambios
          </Button>
          <Button variant="outline">Cancelar</Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function AdminConfiguracionPage() {
  return (
    <AuthGuard>
      <AdminConfiguracionContent />
    </AuthGuard>
  )
}
