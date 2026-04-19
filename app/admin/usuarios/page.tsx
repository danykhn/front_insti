"use client"

import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  Power,
  PowerOff,
} from "lucide-react"
import { useEffect, useState } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AuthGuard } from "@/components/auth-guard"

import usersService, { User, UserRole } from "@/lib/api/usersService"
import { useStore } from "@/lib/store"

function AdminUsuariosContent() {
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [formRole, setFormRole] = useState<UserRole>("CURSANTE")
  const [formFirstName, setFormFirstName] = useState("")
  const [formLastName, setFormLastName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPassword, setFormPassword] = useState("")
  
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const usuario = useStore((state) => state.usuario)
  const accessToken = useStore((state) => state.accessToken)

  useEffect(() => {
    if (accessToken) {
      usersService.setToken(accessToken)
    }
    cargarUsuarios()
  }, [accessToken])

  function cargarUsuarios() {
    setLoading(true)
    setError(null)
    usersService.getUsers()
      .then(setUsuarios)
      .catch(() => setError("No se pudieron cargar los usuarios"))
      .finally(() => setLoading(false))
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const fullName = `${u.firstName} ${u.lastName}`.toLowerCase()
    const matchSearch = fullName.includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole = !selectedRole || u.role === selectedRole
    return matchSearch && matchRole
  })

  const getRolColor = (rol: string) => {
    switch (rol) {
      case "ADMIN": return "bg-red-100 text-red-800"
      case "EMPLEADO": return "bg-blue-100 text-blue-800"
      case "CURSANTE": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRolLabel = (rol: string) => {
    switch (rol) {
      case "ADMIN": return "Administrador"
      case "EMPLEADO": return "Empleado"
      case "CURSANTE": return "Cursante"
      default: return rol
    }
  }

  const handleOpenModal = (user?: User) => {
    setEditUser(user || null)
    setModalError(null)
    setFormFirstName(user?.firstName || "")
    setFormLastName(user?.lastName || "")
    setFormEmail(user?.email || "")
    setFormPassword("")
    setFormRole(user?.role || "CURSANTE")
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setModalError(null)
    
    if (!formFirstName?.trim() || !formLastName?.trim()) {
      setModalError("El nombre y apellido son requeridos")
      setSaving(false)
      return
    }

    if (!editUser && !formEmail?.trim()) {
      setModalError("El email es requerido")
      setSaving(false)
      return
    }

    try {
      if (!accessToken) {
        setModalError("No hay sesión activa")
        setSaving(false)
        return
      }
      usersService.setToken(accessToken)
      if (editUser) {
        await usersService.updateUser(editUser.id, { firstName: formFirstName.trim(), lastName: formLastName.trim(), role: formRole })
      } else {
        if (!formPassword?.trim()) {
          setModalError("La contraseña es requerida")
          setSaving(false)
          return
        }
        await usersService.createUser({ firstName: formFirstName.trim(), lastName: formLastName.trim(), email: formEmail.trim(), password: formPassword, role: formRole })
      }
      setModalOpen(false)
      cargarUsuarios()
    } catch (err: any) {
      setModalError(err?.response?.data?.message || err?.message || "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    if (!accessToken) return
    setActionLoading(confirmDelete.id)
    usersService.setToken(accessToken)
    try {
      await usersService.deleteUser(confirmDelete.id)
      setConfirmDelete(null)
      cargarUsuarios()
    } catch (err: any) {
      setError(err?.message || "No se pudo eliminar")
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleActive = async (user: User) => {
    if (!accessToken) return
    setActionLoading(user.id)
    usersService.setToken(accessToken)
    try {
      if (user.isActive) {
        await usersService.deactivateUser(user.id)
      } else {
        await usersService.activateUser(user.id)
      }
      cargarUsuarios()
    } catch (err: any) {
      setError(err?.message || "No se pudo cambiar el estado")
    } finally {
      setActionLoading(null)
    }
  }

  if (usuario.rol !== "ADMIN") {
    return (
      <DashboardLayout title="Usuarios">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Solo el administrador puede acceder.</CardTitle>
          </CardHeader>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Usuarios" breadcrumbs={[{ label: "Administración" }, { label: "Usuarios" }]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra todos los usuarios del sistema</p>
          </div>
          <Button className="w-full sm:w-auto" onClick={() => handleOpenModal()}>
            <Plus className="size-4 mr-2" />
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
                Todos ({usuarios.length})
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

        {/* Tabla */}
        <Card>
          <CardHeader>
            <CardTitle>Usuarios ({usuariosFiltrados.length})</CardTitle>
            <CardDescription>Lista de usuarios registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-6 flex items-center gap-3"><Loader2 className="animate-spin size-5" /> Cargando...</div>
            ) : error ? (
              <div className="text-destructive py-6">{error}</div>
            ) : (
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
                    {usuariosFiltrados.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{u.firstName} {u.lastName}</td>
                        <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                        <td className="py-3 px-4">
                          <Badge className={getRolColor(u.role)}>{getRolLabel(u.role)}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {u.isActive ? (
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
                        <td className="py-3 px-4 text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(u)} disabled={actionLoading === u.id}>
                              <Edit className="size-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={u.isActive ? "text-amber-600" : "text-green-600"}
                              onClick={() => handleToggleActive(u)}
                              disabled={actionLoading === u.id}
                            >
                              {actionLoading === u.id ? <Loader2 className="size-4 animate-spin" /> : u.isActive ? <PowerOff className="size-4" /> : <Power className="size-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirmDelete(u)} disabled={actionLoading === u.id}>
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-100">
                <Users className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usuarios.filter(u => u.role === "CURSANTE").length}</p>
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
                <p className="text-2xl font-bold">{usuarios.filter(u => u.role === "EMPLEADO").length}</p>
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
                <p className="text-2xl font-bold">{usuarios.filter(u => u.role === "ADMIN").length}</p>
                <p className="text-sm text-muted-foreground">Administradores</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{editUser ? "Editar Usuario" : "Nuevo Usuario"}</h2>
            
            <div>
              <Label htmlFor="firstName">Nombre</Label>
              <Input 
                name="firstName" 
                id="firstName" 
                value={formFirstName} 
                onChange={(e) => setFormFirstName(e.target.value)} 
                required 
                disabled={saving} 
              />
            </div>
            
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input 
                name="lastName" 
                id="lastName" 
                value={formLastName} 
                onChange={(e) => setFormLastName(e.target.value)} 
                required 
                disabled={saving} 
              />
            </div>
            
            {formEmail && (
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  name="email" 
                  id="email" 
                  type="email" 
                  value={formEmail} 
                  disabled={true} 
                  className="bg-muted"
                />
              </div>
            )}
            
            {!editUser && (
              <>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    name="email" 
                    id="email" 
                    type="email" 
                    value={formEmail} 
                    onChange={(e) => setFormEmail(e.target.value)} 
                    required 
                    disabled={saving} 
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input 
                    name="password" 
                    id="password" 
                    type="password" 
                    value={formPassword} 
                    onChange={(e) => setFormPassword(e.target.value)} 
                    required={!editUser}
                    disabled={saving} 
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="role">Rol</Label>
              <Select value={formRole} onValueChange={(v) => setFormRole(v as UserRole)}>
                <SelectTrigger disabled={saving}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CURSANTE">Cursante</SelectItem>
                  <SelectItem value="EMPLEADO">Empleado</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {modalError && <div className="text-destructive text-sm">{modalError}</div>}

            <div className="flex gap-2 justify-end mt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <><Loader2 className="animate-spin size-4 mr-2" />Guardando...</> : editUser ? "Guardar Cambios" : "Crear"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-white rounded-lg p-6 max-w-xs w-full shadow-xl border flex flex-col gap-4">
            <h2 className="font-semibold text-lg">¿Eliminar usuario?</h2>
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de eliminar a <strong>{confirmDelete.firstName} {confirmDelete.lastName}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={!!actionLoading}>
                {actionLoading ? <Loader2 className="animate-spin size-4" /> : "Eliminar"}
              </Button>
            </div>
          </div>
        </div>
      )}
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