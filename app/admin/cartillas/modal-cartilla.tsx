"use client";

import { useEffect, useState } from "react";
import { Cartilla } from "@/lib/api/cartillasService";
import cartillasService from "@/lib/api/cartillasService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface ModalCartillaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartilla: Cartilla | null;
  onSuccess: () => void;
}

export default function ModalCartilla({ open, onOpenChange, cartilla, onSuccess }: ModalCartillaProps) {
  const isEdit = Boolean(cartilla);
  const [form, setForm] = useState<Record<string, any>>({
    titulo: "",
    descripcion: "",
    autor: "",
    materia: "",
    carrera: "",
    precio: 0,
    cantidad: 0,
    imagen: "",
    etiquetas: [],
  });
  const [etiquetas, setEtiquetas] = useState<{ id: string; nombre: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && cartilla) {
      setForm({ ...cartilla, etiquetas: (cartilla.etiquetas || []).map((e: any) => typeof e === 'string' ? e : e.nombre), _etiquetaInput: '' });
    } else if (open) {
      setForm({
        titulo: "",
        descripcion: "",
        autor: "",
        materia: "",
        carrera: "",
        precio: 0,
        cantidad: 0,
        imagen: "",
        etiquetas: [],
        _etiquetaInput: '',
      });
    }
    setEtiquetas([]);
  }, [open, cartilla]);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: name === "precio" || name === "cantidad" ? Number(value) : value }));
  }
  function handleEtiqueta(e: any) {
    const val = e.target.value;
    setForm((f) => ({
      ...f,
      etiquetas: Array.from(new Set([...(f.etiquetas || []), etiquetas.find((et) => et.id === val)].filter(Boolean))),
    }));
  }
  function removeEtiqueta(nombre: string) {
    setForm((f) => ({ ...f, etiquetas: ((f.etiquetas as string[]) || []).filter((e) => e !== nombre) }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!form.titulo?.trim()) throw new Error("El título es obligatorio");
      if (!form.materia?.trim()) throw new Error("La materia es obligatoria");
      if (!form.precio || form.precio < 0) throw new Error("El precio debe ser mayor o igual a 0");
      if (!form.cantidad || form.cantidad < 0) throw new Error("El stock debe ser mayor o igual a 0");
      // Limpiar propiedades prohibidas
      const { id, createdAt, updatedAt, _etiquetaInput, ...rest } = form;
      // Mostramos en consola el payload por debug
      console.log('DTO a enviar PATCH/POST:', rest, (rest.etiquetas || []));
      const dto = {
        ...rest,
        etiquetas: Array.isArray(rest.etiquetas)
          ? (rest.etiquetas as any[]).map((e) => typeof e === 'string' ? e.trim() : String(e)).filter(Boolean)
          : [],
      };
      if (isEdit && cartilla) {
        await cartillasService.updateCartilla(cartilla.id, dto);
      } else {
        await cartillasService.createCartilla(dto);
      }
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      setError(err?.message ?? 'Ocurrió un error.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl border flex flex-col gap-4 relative">
        <span className="font-semibold text-lg mb-2">{isEdit ? "Editar Cartilla" : "Nueva Cartilla"}</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Título */}
          <div>
            <Label>Título</Label>
            <Input name="titulo" value={form.titulo || ""} onChange={handleChange} required disabled={saving} />
          </div>
          {/* Autor */}
          <div>
            <Label>Autor</Label>
            <Input name="autor" value={form.autor || ""} onChange={handleChange} disabled={saving} />
          </div>
          {/* Materia */}
          <div>
            <Label>Materia</Label>
            <Input name="materia" value={form.materia || ""} onChange={handleChange} required disabled={saving} />
          </div>
          {/* Carrera */}
          <div>
            <Label>Carrera</Label>
            <Input name="carrera" value={form.carrera || ""} onChange={handleChange} disabled={saving} />
          </div>
          {/* Precio */}
          <div>
            <Label>Precio</Label>
            <Input name="precio" value={form.precio} onChange={handleChange} type="number" min="0" step="0.01" required disabled={saving} />
          </div>
          {/* Cantidad */}
          <div>
            <Label>Stock</Label>
            <Input name="cantidad" value={form.cantidad} onChange={handleChange} type="number" min="0" required disabled={saving} />
          </div>
          {/* Imagen */}
          <div className="col-span-2">
            <Label>URL Imagen</Label>
            <Input name="imagen" value={form.imagen || ""} onChange={handleChange} disabled={saving} />
            {form.imagen && (<div className="mt-1 w-20 h-28 rounded overflow-hidden"><img src={form.imagen} alt="preview" className="w-full h-full object-cover" /></div>)}
          </div>
        </div>
        {/* Descripción */}
        <Label>Descripción</Label>
        <Textarea name="descripcion" value={form.descripcion || ""} onChange={handleChange} required disabled={saving} />
         {/* Etiquetas */}
         <Label>Etiquetas</Label>
         <div className="flex flex-col gap-1 w-full">
           <div className="flex gap-2 flex-wrap mb-1">
             {form.etiquetas && (form.etiquetas as string[]).map((et) => (
               <Badge key={et} className="flex items-center gap-1">
                 {et}
                 <button type="button" onClick={() => removeEtiqueta(et)} className="text-xs ml-1">×</button>
               </Badge>
             ))}
           </div>
           <Input
             type="text"
             placeholder="Agrega una etiqueta y presiona Enter..."
             value={form._etiquetaInput || ""}
             onChange={e => setForm(f => ({ ...f, _etiquetaInput: e.target.value }))}
             onKeyDown={e => {
               const valor = (form._etiquetaInput || "").trim();
               if ((e.key === "Enter" || e.key === ",") && valor) {
                 e.preventDefault();
                 if (!(form.etiquetas as string[]).includes(valor)) {
                   setForm(f => ({ ...f, etiquetas: [...((f.etiquetas as string[]) || []), valor], _etiquetaInput: "" }));
                 } else {
                   setForm(f => ({ ...f, _etiquetaInput: "" }));
                 }
               }
             }}
             disabled={saving}
             autoComplete="off"
           />
           {form._etiquetaInput && !!etiquetas.length && (
             <div className="border rounded-md bg-white shadow absolute mt-10 max-h-32 overflow-y-auto z-20">
               {etiquetas
                 .map(et => et.nombre)
                 .filter(nom => nom.toLowerCase().startsWith((form._etiquetaInput || "").toLowerCase()) 
                   && !(form.etiquetas as string[]).includes(nom))
                 .slice(0, 8)
                 .map(nom => (
                   <div
                     key={nom}
                     className="px-3 py-1 cursor-pointer hover:bg-muted"
                     onMouseDown={e => {
                       e.preventDefault();
                       setForm(f => ({
                         ...f,
                         etiquetas: [...((f.etiquetas as string[]) || []), nom],
                         _etiquetaInput: ""
                       }));
                     }}
                   >
                     {nom}
                   </div>
                 ))}
             </div>
           )}
         </div>
        {error && <div className="text-destructive text-sm">{error}</div>}
        <div className="flex gap-2 justify-end mt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
          <Button type="submit" disabled={saving}>
            {saving ? (<><Loader2 className="animate-spin size-4 mr-2" />Guardando...</>) : (isEdit ? "Guardar Cambios" : "Crear")}
          </Button>
        </div>
      </form>
    </div>
  );
}
