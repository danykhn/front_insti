"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Cartilla {
  id: string
  titulo: string
  descripcion: string
  materia: string
  grado: string
  precio: number
  imagen: string
  disponible: boolean
  stock: number
}

export interface CartItem {
  cartilla: Cartilla
  cantidad: number
}

export interface Pedido {
  id: string
  items: CartItem[]
  total: number
  estado: "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado"
  fechaCreacion: string
  fechaActualizacion: string
  metodoPago?: string
}

export interface Pago {
  id: string
  pedidoId: string
  monto: number
  estado: "pendiente" | "completado" | "fallido" | "reembolsado"
  metodoPago: string
  fechaPago: string
  referencia?: string
}

export interface Usuario {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  avatar?: string
  grado: string
  institucion: string
  rol: "CURSANTE" | "ADMIN" | "EMPLEADO"
}

interface StoreState {
  // Autenticación
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  
  // Usuario
  usuario: Usuario
  setUsuario: (usuario: Usuario) => void
  setRol: (rol: "CURSANTE" | "ADMIN" | "EMPLEADO") => void
  
  // Carrito
  carrito: CartItem[]
  agregarAlCarrito: (cartilla: Cartilla, cantidad?: number) => void
  eliminarDelCarrito: (cartillaId: string) => void
  actualizarCantidad: (cartillaId: string, cantidad: number) => void
  vaciarCarrito: () => void
  getTotalCarrito: () => number
  getCantidadTotal: () => number
  
  // Pedidos
  pedidos: Pedido[]
  crearPedido: () => Pedido | null
  actualizarEstadoPedido: (pedidoId: string, estado: Pedido["estado"]) => void
  
  // Pagos
  pagos: Pago[]
  registrarPago: (pedidoId: string, metodoPago: string) => Pago
}

// Datos de ejemplo para el usuario
const usuarioInicial: Usuario = {
  id: "usr_001",
  nombre: "María García López",
  email: "maria.garcia@estudiante.edu",
  telefono: "+52 55 1234 5678",
  direccion: "Av. Universidad #123, Col. Centro, CDMX",
  grado: "3er Grado - Secundaria",
  institucion: "Instituto Educativo Nacional",
  rol: "CURSANTE",
}

// Datos de ejemplo para pedidos
const pedidosIniciales: Pedido[] = [
  {
    id: "ped_001",
    items: [
      {
        cartilla: {
          id: "cart_001",
          titulo: "Matemáticas Básicas Vol. 1",
          descripcion: "Cartilla de ejercicios de aritmética y álgebra básica",
          materia: "Matemáticas",
          grado: "3er Grado",
          precio: 150,
          imagen: "/placeholder.svg?height=200&width=150",
          disponible: true,
          stock: 25,
        },
        cantidad: 2,
      },
    ],
    total: 300,
    estado: "entregado",
    fechaCreacion: "2025-03-15T10:30:00Z",
    fechaActualizacion: "2025-03-20T14:00:00Z",
    metodoPago: "Transferencia",
  },
  {
    id: "ped_002",
    items: [
      {
        cartilla: {
          id: "cart_003",
          titulo: "Ciencias Naturales",
          descripcion: "Experimentos y actividades de ciencias",
          materia: "Ciencias",
          grado: "3er Grado",
          precio: 180,
          imagen: "/placeholder.svg?height=200&width=150",
          disponible: true,
          stock: 15,
        },
        cantidad: 1,
      },
    ],
    total: 180,
    estado: "enviado",
    fechaCreacion: "2025-04-01T09:00:00Z",
    fechaActualizacion: "2025-04-10T11:30:00Z",
    metodoPago: "Efectivo",
  },
]

// Datos de ejemplo para pagos
const pagosIniciales: Pago[] = [
  {
    id: "pago_001",
    pedidoId: "ped_001",
    monto: 300,
    estado: "completado",
    metodoPago: "Transferencia",
    fechaPago: "2025-03-15T10:35:00Z",
    referencia: "TRF-2025031500001",
  },
  {
    id: "pago_002",
    pedidoId: "ped_002",
    monto: 180,
    estado: "completado",
    metodoPago: "Efectivo",
    fechaPago: "2025-04-01T09:15:00Z",
    referencia: "EFE-2025040100001",
  },
]

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Autenticación
      isAuthenticated: false,
      login: (email: string, password: string) => {
        // Simulación de login - en producción esto sería una llamada a API
        if (email && password.length >= 4) {
          set({ isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => {
        set({ isAuthenticated: false, carrito: [] })
      },
      
      // Usuario
      usuario: usuarioInicial,
      setUsuario: (usuario) => set({ usuario }),
      setRol: (rol) => set((state) => ({ 
        usuario: { ...state.usuario, rol } 
      })),
      
      // Carrito
      carrito: [],
      agregarAlCarrito: (cartilla, cantidad = 1) => {
        const carrito = get().carrito
        const itemExistente = carrito.find((item) => item.cartilla.id === cartilla.id)
        
        if (itemExistente) {
          set({
            carrito: carrito.map((item) =>
              item.cartilla.id === cartilla.id
                ? { ...item, cantidad: Math.min(item.cantidad + cantidad, cartilla.stock) }
                : item
            ),
          })
        } else {
          set({ carrito: [...carrito, { cartilla, cantidad }] })
        }
      },
      eliminarDelCarrito: (cartillaId) => {
        set({ carrito: get().carrito.filter((item) => item.cartilla.id !== cartillaId) })
      },
      actualizarCantidad: (cartillaId, cantidad) => {
        if (cantidad <= 0) {
          get().eliminarDelCarrito(cartillaId)
          return
        }
        set({
          carrito: get().carrito.map((item) =>
            item.cartilla.id === cartillaId
              ? { ...item, cantidad: Math.min(cantidad, item.cartilla.stock) }
              : item
          ),
        })
      },
      vaciarCarrito: () => set({ carrito: [] }),
      getTotalCarrito: () => {
        return get().carrito.reduce(
          (total, item) => total + item.cartilla.precio * item.cantidad,
          0
        )
      },
      getCantidadTotal: () => {
        return get().carrito.reduce((total, item) => total + item.cantidad, 0)
      },
      
      // Pedidos
      pedidos: pedidosIniciales,
      crearPedido: () => {
        const carrito = get().carrito
        if (carrito.length === 0) return null
        
        const nuevoPedido: Pedido = {
          id: `ped_${Date.now()}`,
          items: [...carrito],
          total: get().getTotalCarrito(),
          estado: "pendiente",
          fechaCreacion: new Date().toISOString(),
          fechaActualizacion: new Date().toISOString(),
        }
        
        set({ pedidos: [nuevoPedido, ...get().pedidos], carrito: [] })
        return nuevoPedido
      },
      actualizarEstadoPedido: (pedidoId, estado) => {
        set({
          pedidos: get().pedidos.map((pedido) =>
            pedido.id === pedidoId
              ? { ...pedido, estado, fechaActualizacion: new Date().toISOString() }
              : pedido
          ),
        })
      },
      
      // Pagos
      pagos: pagosIniciales,
      registrarPago: (pedidoId, metodoPago) => {
        const pedido = get().pedidos.find((p) => p.id === pedidoId)
        if (!pedido) throw new Error("Pedido no encontrado")
        
        const nuevoPago: Pago = {
          id: `pago_${Date.now()}`,
          pedidoId,
          monto: pedido.total,
          estado: "completado",
          metodoPago,
          fechaPago: new Date().toISOString(),
          referencia: `${metodoPago.toUpperCase().slice(0, 3)}-${Date.now()}`,
        }
        
        set({ pagos: [nuevoPago, ...get().pagos] })
        get().actualizarEstadoPedido(pedidoId, "pagado")
        
        return nuevoPago
      },
    }),
    {
      name: "cartillas-storage",
    }
  )
)

// Catálogo de cartillas
export const catalogoCartillas: Cartilla[] = [
  {
    id: "cart_001",
    titulo: "Matemáticas Básicas Vol. 1",
    descripcion: "Cartilla completa de ejercicios de aritmética y álgebra básica para reforzar conceptos fundamentales.",
    materia: "Matemáticas",
    grado: "3er Grado",
    precio: 150,
    imagen: "/placeholder.svg?height=200&width=150",
    disponible: true,
    stock: 25,
  },
  {
    id: "cart_002",
    titulo: "Español y Literatura",
    descripcion: "Ejercicios de comprensión lectora, gramática y redacción para mejorar las habilidades lingüísticas.",
    materia: "Español",
    grado: "3er Grado",
    precio: 140,
    imagen: "/placeholder.svg?height=200&width=150",
    disponible: true,
    stock: 30,
  },
  {
    id: "cart_003",
    titulo: "Ciencias Naturales",
    descripcion: "Experimentos prácticos y actividades de ciencias para aprender haciendo.",
    materia: "Ciencias",
    grado: "3er Grado",
    precio: 180,
    imagen: "/placeholder.svg?height=200&width=150",
    disponible: true,
    stock: 15,
  },
  {
    id: "cart_004",
    titulo: "Historia Universal",
    descripcion: "Recorrido por las principales civilizaciones y eventos históricos con actividades interactivas.",
    materia: "Historia",
    grado: "3er Grado",
    precio: 160,
    imagen: "/placeholder.svg?height=200&width=150",
    disponible: true,
    stock: 20,
  },
  {
    id: "cart_005",
    titulo: "Geografía de México",
    descripcion: "Mapas, ejercicios y actividades para conocer la geografía nacional.",
    materia: "Geografía",
    grado: "3er Grado",
    precio: 155,
    imagen: "/placeholder.svg?height=200&width=150",
    disponible: true,
    stock: 18,
  },
  {
    id: "cart_006",
    titulo: "Inglés Intermedio",
    descripcion: "Vocabulario, gramática y ejercicios de conversación en inglés nivel intermedio.",
    materia: "Inglés",
    grado: "3er Grado",
    precio: 170,
    imagen: "/placeholder.svg?height=200&width=150",
    disponible: true,
    stock: 22,
  },
  {
    id: "cart_007",
    titulo: "Formación Cívica",
    descripcion: "Valores, ciudadanía y participación social para formar estudiantes responsables.",
    materia: "Civismo",
    grado: "3er Grado",
    precio: 130,
    imagen: "/placeholder.svg?height=200&width=150",
    disponible: false,
    stock: 0,
  },
  {
    id: "cart_008",
    titulo: "Matemáticas Avanzadas",
    descripcion: "Ecuaciones, funciones y geometría analítica para estudiantes avanzados.",
    materia: "Matemáticas",
    grado: "3er Grado",
    precio: 190,
    imagen: "/placeholder.svg?height=200&width=150",
    disponible: true,
    stock: 12,
  },
  {
    id: "cart_009",
    titulo: "Arte y Expresión",
    descripcion: "Técnicas artísticas, historia del arte y proyectos creativos.",
    materia: "Artes",
    grado: "3er Grado",
    precio: 145,
    imagen: "/placeholder.svg?height=200&width=150",
    disponible: true,
    stock: 28,
  },
  {
    id: "cart_010",
    titulo: "Educación Física",
    descripcion: "Rutinas de ejercicio, deportes y vida saludable.",
    materia: "Ed. Física",
    grado: "3er Grado",
    precio: 120,
    imagen: "/placeholder.svg?height=200&width=150",
    disponible: true,
    stock: 35,
  },
]
