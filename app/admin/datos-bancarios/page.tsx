"use client"

import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  Building,
  User,
  Hash,
} from "lucide-react"
import { useEffect, useState } from "react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthGuard } from "@/components/auth-guard"
import datosBancariosService, { DatosBancarios } from "@/lib/api/datosBancariosService"
import { useStore } from "@/lib/store"

function AdminDatosBancariosContent() {
  const [datos, setDatos] = useState<DatosBancarios[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState<DatosBancarios | null>(null)
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  
  const [confirmDelete, setConfirmDelete] = useState<DatosBancarios | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const accessToken = useStore((state) => state.accessToken)
  const usuario = useStore((state) => state.usuario)

  useEffect(() => {
    if (accessToken) {
      datosBancariosService.setToken(accessToken)
    }
    cargarDatos()
  }, [accessToken])

  function cargarDatos() {
    setLoading(true)
    setError(null)
    datosBancariosService.getAll()
      .then(setDatos)
      .catch(() => setError("No se pudieron cargar los datos bancarios"))
      .finally(() => setLoading(false))
  }

  const datosFiltrados = datos.filter((d) => {
    const matchSearch = 
      d.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.titular.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nombreBanco.toLowerCase().includes(searchTerm.toLowerCase())
    return matchSearch
  })

  const handleOpenModal = (data?: DatosBancarios) => {
    setEditData(data || null)
    setModalError(null)
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setModalError(null)
    
    const formData = new FormData(e.currentTarget)
    const input = {
      alias: formData.get("alias") as string,
      cbu: formData.get("cbu") as string,
      numeroCuenta: formData.get("numeroCuenta") as string,
      titular: formData.get("titular") as string,
      nombreBanco: formData.get("nombreBanco") as string,
    }

    if (!input.alias?.trim() || !input.cbu?.trim() || !input.numeroCuenta?.trim() || !input.titular?.trim() || !input.nombreBanco?.trim()) {
      setModalError("Todos los campos son requeridos")
      setSaving(false)
      return
    }

    try {
      if (editData) {
        await datosBancariosService.update(editData.id, input)
      } else {
        await datosBancariosService.create(input)
      }
      setModalOpen(false)
      cargarDatos()
    } catch (err: any) {
      setModalError(err?.response?.data?.message || err?.message || "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    setActionLoading(confirmDelete.id)
    try {
      await datosBancariosService.delete(confirmDelete.id)
      setConfirmDelete(null)
      cargarDatos()
    } catch (err: any) {
      setError(err?.message || "No se pudo eliminar")
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleActive = async (data: DatosBancarios) => {
    setActionLoading(data.id)
    try {
      if (data.isActive) {
        await datosBancariosService.deactivate(data.id)
      } else {
        await datosBancariosService.activate(data.id)
      }
      cargarDatos()
    } catch (err: any) {
      setError(err?.message || "No se pudo cambiar el estado")
    } finally {
      setActionLoading(null)
    }
  }

  if (usuario.rol !== "ADMIN") {
    return (
      <DashboardLayout title="Datos Bancarios">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Solo el administrador puede acceder.</CardTitle>
          </CardHeader>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Datos Bancarios" breadcrumbs={[{ label: "Administración" }, { label: "Datos Bancarios" }]}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Datos Bancarios</h1>
            <p className="text-muted-foreground">Administra las cuentas bancarias para transferencias</p>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="size-4 mr-2" />
            Nueva Cuenta
          </Button>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="Buscar por alias, titular o banco..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Card>
          <CardHeader>
            <CardTitle>Cuentas Bancarias ({datosFiltrados.length})</CardTitle>
            <CardDescription>Cuentas disponibles para transferencias</CardDescription>
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
                      <th className="text-left py-3 px-4 font-medium">Alias</th>
                      <th className="text-left py-3 px-4 font-medium">Banco</th>
                      <th className="text-left py-3 px-4 font-medium">Titular</th>
                      <th className="text-left py-3 px-4 font-medium">CBU</th>
                      <th className="text-left py-3 px-4 font-medium">N° Cuenta</th>
                      <th className="text-left py-3 px-4 font-medium">Estado</th>
                      <th className="text-left py-3 px-4 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosFiltrados.map((d) => (
                      <tr key={d.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{d.alias}</td>
                        <td className="py-3 px-4">{d.nombreBanco}</td>
                        <td className="py-3 px-4">{d.titular}</td>
                        <td className="py-3 px-4 font-mono text-xs">{d.cbu}</td>
                        <td className="py-3 px-4 font-mono text-xs">{d.numeroCuenta}</td>
                        <td className="py-3 px-4">
                          <Badge className={d.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {d.isActive ? "Activa" : "Inactiva"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(d)} disabled={actionLoading === d.id}>
                              <Edit className="size-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={d.isActive ? "text-amber-600" : "text-green-600"}
                              onClick={() => handleToggleActive(d)}
                              disabled={actionLoading === d.id}
                            >
                              {actionLoading === d.id ? <Loader2 className="size-4 animate-spin" /> : d.isActive ? <XCircle className="size-4" /> : <CheckCircle className="size-4" />}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirmDelete(d)} disabled={actionLoading === d.id}>
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
      </div>

      {/* Modal Create/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{editData ? "Editar Cuenta Bancaria" : "Nueva Cuenta Bancaria"}</h2>
            
            <div>
              <Label htmlFor="alias">Alias</Label>
              <Input name="alias" id="alias" defaultValue={editData?.alias} required disabled={saving} placeholder="Mi cuenta principal" />
            </div>
            
            <div>
              <Label htmlFor="nombreBanco">Banco</Label>
              <Input name="nombreBanco" id="nombreBanco" defaultValue={editData?.nombreBanco} required disabled={saving} placeholder="Banco Galicia" />
            </div>
            
            <div>
              <Label htmlFor="titular">Titular</Label>
              <Input name="titular" id="titular" defaultValue={editData?.titular} required disabled={saving} placeholder="Juan Pérez" />
            </div>
            
            <div>
              <Label htmlFor="cbu">CBU</Label>
              <Input name="cbu" id="cbu" defaultValue={editData?.cbu} required disabled={saving} placeholder="1234567890123456789012" maxLength={22} />
            </div>
            
            <div>
              <Label htmlFor="numeroCuenta">Número de Cuenta</Label>
              <Input name="numeroCuenta" id="numeroCuenta" defaultValue={editData?.numeroCuenta} required disabled={saving} placeholder="1234567890" />
            </div>

            {modalError && <div className="text-destructive text-sm">{modalError}</div>}

            <div className="flex gap-2 justify-end mt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <><Loader2 className="animate-spin size-4 mr-2" />Guardando...</> : editData ? "Guardar Cambios" : "Crear"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-white rounded-lg p-6 max-w-xs w-full shadow-xl border flex flex-col gap-4">
            <h2 className="font-semibold text-lg">¿Eliminar cuenta?</h2>
            <p className="text-sm text-muted-foreground">
              ¿Estás seguro de eliminar la cuenta <strong>{confirmDelete.alias}</strong>? Esta acción no se puede deshacer.
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

export default function AdminDatosBancariosPage() {
  return (
    <AuthGuard>
      <AdminDatosBancariosContent />
    </AuthGuard>
  )
}