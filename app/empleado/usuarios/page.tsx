"use client"

import {
  Users,
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useState } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AuthGuard } from "@/components/auth-guard"

// Datos simulados de usuarios para empleado
const usuariosSimulados = [
  {
    id: "usr_001",
    nombre: "María García López",
    email: "maria.garcia@estudiante.edu",
    rol: "CURSANTE",
    estado: "activo",
    telefono: "+52 55 1234 5678",
    fechaRegistro: "2025-01-15",
  },
  {
    id: "usr_004",
    nombre: "Juan Sánchez López",
    email: "juan.sanchez@estudiante.edu",
    rol: "CURSANTE",
    estado: "activo",
    telefono: "+52 55 8765 4321",
    fechaRegistro: "2025-01-20",
  },
  {
    id: "usr_005",
    nombre: "Laura Fernández Ruiz",
    email: "laura.fernandez@estudiante.edu",
    rol: "CURSANTE",
    estado: "inactivo",
    telefono: "+52 55 5555 5555",
    fechaRegistro: "2025-02-01",
  },
]

function EmpleadoUsuariosContent() {
  const [searchTerm, setSearchTerm] = useState("")

  const usuariosFiltrados = usuariosSimulados.filter((usuario) => {
    const matchSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSearch
  })

  return (
    <DashboardLayout
      title="Usuarios"
      breadcrumbs={[{ label: "Empleado" }, { label: "Usuarios" }]}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Información de Usuarios</h1>
          <p className="text-muted-foreground">Visualiza información de clientes y cursantes</p>
        </div>

        {/* Estadísticas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuariosSimulados.length}</p>
                <p className="text-sm text-muted-foreground">Total de Cursantes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100">
                <CheckCircle className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuariosSimulados.filter(u => u.estado === "activo").length}</p>
                <p className="text-sm text-muted-foreground">Usuarios Activos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-amber-100">
                <AlertCircle className="size-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuariosSimulados.filter(u => u.estado === "inactivo").length}</p>
                <p className="text-sm text-muted-foreground">Inactivos</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Búsqueda */}
        <Card>
          <CardContent className="pt-6">
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Tabla de usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Cursantes ({usuariosFiltrados.length})</CardTitle>
            <CardDescription>Lista de cursantes registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Teléfono</th>
                    <th className="text-left py-3 px-4 font-medium">Estado</th>
                    <th className="text-left py-3 px-4 font-medium">Registro</th>
                    <th className="text-left py-3 px-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{usuario.nombre}</td>
                      <td className="py-3 px-4 text-muted-foreground">{usuario.email}</td>
                      <td className="py-3 px-4 text-muted-foreground">{usuario.telefono}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {usuario.estado === "activo" ? (
                            <>
                              <CheckCircle className="size-4 text-green-600" />
                              <span className="text-green-600">Activo</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="size-4 text-amber-600" />
                              <span className="text-amber-600">Inactivo</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{usuario.fechaRegistro}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default function EmpleadoUsuariosPage() {
  return (
    <AuthGuard>
      <EmpleadoUsuariosContent />
    </AuthGuard>
  )
}
