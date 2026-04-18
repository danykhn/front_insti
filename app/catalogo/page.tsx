"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, Filter, ShoppingCart, Check, X, Loader2 } from "lucide-react"

import { DashboardLayout } from "@/components/dashboard-layout"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStore, type Cartilla } from "@/lib/store"
import { useCartillas } from "@/lib/hooks/useCartillas"

function CatalogoPageContent() {
  const [busqueda, setBusqueda] = useState("")
  const [materiaFiltro, setMateriaFiltro] = useState<string>("todas")
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState<string>("todas")
  const [ordenar, setOrdenar] = useState<string>("nombre")

  const { cartillas, isLoading, error, cargarCartillas } = useCartillas()
  const agregarAlCarrito = useStore((state) => state.agregarAlCarrito)
  const carrito = useStore((state) => state.carrito)

  useEffect(() => {
    cargarCartillas()
  }, [cargarCartillas])

  const materias = useMemo(() => {
    const uniqueMaterias = [...new Set(cartillas.map((c) => c.materia))]
    return uniqueMaterias.sort()
  }, [cartillas])

  const cartillasEnCarrito = useMemo(() => {
    return new Set(carrito.map((item) => item.cartilla.id))
  }, [carrito])

  const cartillasFiltradas = useMemo(() => {
    let resultado = [...cartillas]

    // Filtro por búsqueda
    if (busqueda) {
      const searchLower = busqueda.toLowerCase()
      resultado = resultado.filter(
        (c) =>
          c.titulo.toLowerCase().includes(searchLower) ||
          c.descripcion.toLowerCase().includes(searchLower) ||
          c.materia.toLowerCase().includes(searchLower)
      )
    }

    // Filtro por materia
    if (materiaFiltro !== "todas") {
      resultado = resultado.filter((c) => c.materia === materiaFiltro)
    }

    // Filtro por disponibilidad
    if (disponibilidadFiltro === "disponible") {
      resultado = resultado.filter((c) => c.cantidad > 0)
    } else if (disponibilidadFiltro === "agotado") {
      resultado = resultado.filter((c) => c.cantidad === 0)
    }

    // Ordenar
    switch (ordenar) {
      case "nombre":
        resultado.sort((a, b) => a.titulo.localeCompare(b.titulo))
        break
      case "precio-asc":
        resultado.sort((a, b) => a.precio - b.precio)
        break
      case "precio-desc":
        resultado.sort((a, b) => b.precio - a.precio)
        break
      case "materia":
        resultado.sort((a, b) => a.materia.localeCompare(b.materia))
        break
    }

    return resultado
  }, [busqueda, materiaFiltro, disponibilidadFiltro, ordenar, cartillas])

  const handleAgregarAlCarrito = (cartilla: Cartilla) => {
    agregarAlCarrito(cartilla, 1)
  }

  return (
    <DashboardLayout
      title="Catálogo"
      breadcrumbs={[{ label: "Catálogo" }]}
    >
      <div className="flex flex-col gap-6">
        {/* Encabezado */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Catálogo de Cartillas</h1>
          <p className="text-muted-foreground">
            Explora nuestra colección completa de cartillas educativas.
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              {/* Búsqueda */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar cartillas..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filtro por materia */}
              <Select value={materiaFiltro} onValueChange={setMateriaFiltro}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Materia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las materias</SelectItem>
                  {materias.map((materia) => (
                    <SelectItem key={materia} value={materia}>
                      {materia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro por disponibilidad */}
              <Select value={disponibilidadFiltro} onValueChange={setDisponibilidadFiltro}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="disponible">Disponibles</SelectItem>
                  <SelectItem value="agotado">Agotadas</SelectItem>
                </SelectContent>
              </Select>

              {/* Ordenar */}
              <Select value={ordenar} onValueChange={setOrdenar}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nombre">Nombre (A-Z)</SelectItem>
                  <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="materia">Materia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {cartillasFiltradas.length} cartilla{cartillasFiltradas.length !== 1 ? "s" : ""} encontrada{cartillasFiltradas.length !== 1 ? "s" : ""}
          </p>
          {(busqueda || materiaFiltro !== "todas" || disponibilidadFiltro !== "todas") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setBusqueda("")
                setMateriaFiltro("todas")
                setDisponibilidadFiltro("todas")
              }}
            >
              Limpiar filtros
              <X className="size-4" />
            </Button>
          )}
        </div>

        {/* Grid de cartillas */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Cargando catálogo...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-red-100">
                  <X className="size-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900">Error al cargar el catálogo</h3>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : cartillasFiltradas.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cartillasFiltradas.map((cartilla) => {
              const estaEnCarrito = cartillasEnCarrito.has(cartilla.id)
              const isAvailable = cartilla.cantidad > 0
              
              return (
                <Card
                  key={cartilla.id}
                  className={`group overflow-hidden transition-all hover:shadow-md ${
                    !isAvailable ? "opacity-60" : ""
                  }`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={cartilla.imagen}
                      alt={cartilla.titulo}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                        <Badge variant="destructive">Agotado</Badge>
                      </div>
                    )}
                    {cartilla.cantidad > 0 && cartilla.cantidad <= 5 && (
                      <Badge
                        variant="outline"
                        className="absolute right-2 top-2 bg-background/90"
                      >
                        Últimas {cartilla.cantidad}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="flex flex-col gap-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="secondary" className="shrink-0">
                        {cartilla.materia}
                      </Badge>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {cartilla.carrera}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="line-clamp-2 font-semibold leading-tight">
                        {cartilla.titulo}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {cartilla.descripcion}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Por: {cartilla.autor}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-xl font-bold text-primary">
                        ${cartilla.precio.toLocaleString("es-MX")}
                      </span>
                      <Button
                        size="sm"
                        disabled={!isAvailable}
                        variant={estaEnCarrito ? "secondary" : "default"}
                        onClick={() => handleAgregarAlCarrito(cartilla)}
                      >
                        {estaEnCarrito ? (
                          <>
                            <Check className="size-4" />
                            En carrito
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="size-4" />
                            Agregar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="flex flex-col items-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <Search className="size-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No se encontraron cartillas</h3>
                <p className="text-sm text-muted-foreground">
                  Intenta ajustar los filtros o la búsqueda
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setBusqueda("")
                  setMateriaFiltro("todas")
                  setDisponibilidadFiltro("todas")
                }}
              >
                Limpiar filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function CatalogoPage() {
  return (
    <AuthGuard>
      <CatalogoPageContent />
    </AuthGuard>
  )
}
