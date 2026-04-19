"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AuthGuard } from "@/components/auth-guard";
import cartillasService, { Cartilla } from "@/lib/api/cartillasService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, PlusCircle, Trash2, Search, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import ModalCartilla from "./modal-cartilla";

function CartillasAdmin() {
  const [cartillas, setCartillas] = useState<Cartilla[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCartilla, setEditCartilla] = useState<Cartilla | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Cartilla | null>(null);
  const usuario = useStore((state) => state.usuario);

  useEffect(() => {
    cargarCartillas();
  }, []);

  function cargarCartillas() {
    setLoading(true);
    setError(null);
    cartillasService
      .getCartillas()
      .then(setCartillas)
      .catch(() => setError("No se pudieron cargar las cartillas"))
      .finally(() => setLoading(false));
  }

  function onEditar(cartilla: Cartilla) {
    setEditCartilla(cartilla);
    setModalOpen(true);
  }
  function onNueva() {
    setEditCartilla(null);
    setModalOpen(true);
  }

  function onDelete(cartilla: Cartilla) {
    setConfirmDelete(cartilla);
  }
  function confirmDeleteCartilla() {
    if (!confirmDelete) return;
    setLoading(true);
    cartillasService
      .deleteCartilla(confirmDelete.id)
      .then(() => {
        setCartillas((prev) => prev.filter((c) => c.id !== confirmDelete.id));
      })
      .catch(() => setError("No se pudo eliminar la cartilla"))
      .finally(() => {
        setConfirmDelete(null);
        setLoading(false);
      });
  }

  function buscarCartillas(cartillas: Cartilla[]) {
    return cartillas.filter(
      (c) =>
        c.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.autor?.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.materia?.toLowerCase().includes(busqueda.toLowerCase())
    );
  }

  if (usuario.rol !== "ADMIN")
    return (
      <DashboardLayout title="Cartillas">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Solo el administrador puede acceder.</CardTitle>
          </CardHeader>
        </Card>
      </DashboardLayout>
    );

  return (
    <DashboardLayout title="Cartillas">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center gap-2 mt-2">
          <h1 className="text-2xl font-bold">Cartillas</h1>
          <Button onClick={onNueva}><PlusCircle className="size-4 mr-2" />Nueva Cartilla</Button>
        </div>
        <div className="flex gap-2 items-center">
<Input
             placeholder="Buscar por título, autor, materia..."
             value={busqueda}
             onChange={(e) => setBusqueda(e.target.value)}
             className="max-w-xs"
           />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Listado de Cartillas</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <div className="py-6 flex items-center gap-3"><Loader2 className="animate-spin size-5" /> Cargando...</div>
            ) : error ? (
              <div className="text-destructive py-6">{error}</div>
            ) : (
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="font-medium px-3 py-2 border-b">Título</th>
                    <th className="font-medium px-3 py-2 border-b">Autor</th>
                    <th className="font-medium px-3 py-2 border-b">Materia</th>
                    <th className="font-medium px-3 py-2 border-b">Precio</th>
                    <th className="font-medium px-3 py-2 border-b">Stock</th>
                    <th className="font-medium px-3 py-2 border-b">Etiquetas</th>
                    <th className="font-medium px-3 py-2 border-b">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {buscarCartillas(cartillas).map((cartilla) => (
                    <tr key={cartilla.id} className="border-b hover:bg-muted/30">
                      <td className="px-3 py-2">{cartilla.titulo}</td>
                      <td className="px-3 py-2">{cartilla.autor}</td>
                      <td className="px-3 py-2">{cartilla.materia}</td>
                      <td className="px-3 py-2">${cartilla.precio}</td>
                      <td className="px-3 py-2">{cartilla.cantidad}</td>
                      <td className="px-3 py-2">
                        {cartilla.etiquetas?.map((e: any, idx: number) => (
                          <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                            {typeof e === 'string' ? e : e.nombre}
                          </Badge>
                        ))}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => onEditar(cartilla)}>
                            <Pencil className="size-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete(cartilla)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Modal para crear/editar cartilla */}
      <ModalCartilla
        open={modalOpen}
        onOpenChange={setModalOpen}
        cartilla={editCartilla}
        onSuccess={() => {
          setModalOpen(false);
          cargarCartillas();
        }}
      />
      {/* Modal de confirmación eliminar */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
          <div className="bg-white rounded-lg p-6 max-w-xs w-full shadow-xl border flex flex-col gap-4">
            <span className="font-semibold">¿Eliminar cartilla?
              <br /><span className="text-sm font-normal">{confirmDelete.titulo}</span>
            </span>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={confirmDeleteCartilla}>Eliminar</Button>
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function Page() {
  return (
    <AuthGuard>
      <CartillasAdmin />
    </AuthGuard>
  );
}
