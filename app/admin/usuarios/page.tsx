"use client"

import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
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

// Datos simulados de usuarios
const usuariosSimulados = [
  {
    id: "usr_001",
    nombre: "María García López",
    email: "maria.garcia@estudiante.edu",
    rol: "CURSANTE",
    estado: "activo",
    fechaRegistro: "2025-01-15",
  },
  {
    id: "usr_002",
    nombre: "Carlos Rodriguez Mendez",
    email: "carlos.rodriguez@empleado.edu",
    rol: "EMPLEADO",
    estado: "activo",
    fechaRegistro: "2025-02-10",
  },
  {
    id: "usr_003",
    nombre: "Ana Martínez Pérez",
    email: "ana.martinez@admin.edu",
    rol: "ADMIN",
    estado: "activo",
    fechaRegistro: "2024-12-01",
  },
  {
    id: "usr_004",
    nombre: "Juan Sánchez López",
    email: "juan.sanchez@estudiante.edu",
    rol: "CURSANTE",
    estado: "inactivo",
    fechaRegistro: "2025-01-20",
  },
]

function AdminUsuariosContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  const usuariosFiltrados = usuariosSimulados.filter((usuario) => {
    const matchSearch = usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole = !selectedRole || usuario.rol === selectedRole
    return matchSearch && matchRole
  })

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "ADMIN":
        return "bg-red-100 text-red-800"
      case "EMPLEADO":
        return "bg-blue-100 text-blue-800"
      case "CURSANTE":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRolLabel = (rol: string) => {
    switch (rol) {
      case "ADMIN":
        return "Administrador"
      case "EMPLEADO":
        return "Empleado"
      case "CURSANTE":
        return "Cursante"
      default:
        return rol
    }
  }

  return (
    <DashboardLayout
      title="Gestión de Usuarios"
      breadcrumbs={[{ label: "Administración" }, { label: "Usuarios" }]}
    >
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra todos los usuarios del sistema</p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="size-4" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedRole === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole(null)}
              >
                Todos ({usuariosSimulados.length})
              </Button>
              <Button
                variant={selectedRole === "ADMIN" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole("ADMIN")}
              >
                Admin
              </Button>
              <Button
                variant={selectedRole === "EMPLEADO" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole("EMPLEADO")}
              >
                Empleado
              </Button>
              <Button
                variant={selectedRole === "CURSANTE" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole("CURSANTE")}
              >
                Cursante
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de usuarios */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios ({usuariosFiltrados.length})</CardTitle>
            <CardDescription>Lista de usuarios registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">Nombre</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Rol</th>
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
                      <td className="py-3 px-4">
                        <Badge className={getRolColor(usuario.rol)}>
                          {getRolLabel(usuario.rol)}
                        </Badge>
                      </td>
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
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="size-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuariosSimulados.filter(u => u.rol === "CURSANTE").length}</p>
                <p className="text-sm text-muted-foreground">Cursantes</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuariosSimulados.filter(u => u.rol === "EMPLEADO").length}</p>
                <p className="text-sm text-muted-foreground">Empleados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-red-100">
                <Users className="size-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuariosSimulados.filter(u => u.rol === "ADMIN").length}</p>
                <p className="text-sm text-muted-foreground">Administradores</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function AdminUsuariosPage() {
  return (
    <AuthGuard>
      <AdminUsuariosContent />
    </AuthGuard>
  )
}
