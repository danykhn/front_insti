"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  BookOpen,
  ShoppingCart,
  Package,
  CreditCard,
  User,
  Home,
  LogOut,
  Users,
  Settings,
  FileText,
  BarChart3,
  ClipboardList,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import authService from "@/lib/auth/authService"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const menuItemsCursante = [
  {
    title: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    title: "Catálogo",
    href: "/catalogo",
    icon: BookOpen,
  },
  {
    title: "Carrito",
    href: "/carrito",
    icon: ShoppingCart,
    showBadge: true,
  },
  {
    title: "Mis Pedidos",
    href: "/pedidos",
    icon: Package,
  },
  {
    title: "Pagos",
    href: "/pagos",
    icon: CreditCard,
  },
]

const menuItemsAdmin = [
  {
    title: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    title: "Gestión de Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    title: "Gestión de Pedidos",
    href: "/admin/pedidos",
    icon: ClipboardList,
  },
  {
    title: "Catálogo",
    href: "/catalogo",
    icon: BookOpen,
  },
  {
    title: "Reportes",
    href: "/admin/reportes",
    icon: BarChart3,
  },
  {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
]

const menuItemsEmpleado = [
  {
    title: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    title: "Gestión de Pedidos",
    href: "/empleado/pedidos",
    icon: ClipboardList,
  },
  {
    title: "Catálogo",
    href: "/catalogo",
    icon: BookOpen,
  },
  {
    title: "Usuarios",
    href: "/empleado/usuarios",
    icon: Users,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const usuario = useStore((state) => state.usuario)
  const logout = useStore((state) => state.logout)
  const getCantidadTotal = useStore((state) => state.getCantidadTotal)
  const cantidadCarrito = getCantidadTotal()

  const getMenuItems = () => {
    switch (usuario.rol) {
      case "ADMIN":
        return menuItemsAdmin
      case "EMPLEADO":
        return menuItemsEmpleado
      default:
        return menuItemsCursante
    }
  }

  const menuItems = getMenuItems()

  const handleLogout = async () => {
    logout()
    authService.logout()
    await signOut({ redirect: false })
    router.push("/login")
  }

  const getRoleLabel = () => {
    switch (usuario.rol) {
      case "ADMIN":
        return "Administrador"
      case "EMPLEADO":
        return "Empleado"
      default:
        return usuario.grado
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Sistema de Cartillas</span>
            <span className="text-xs text-muted-foreground">
              {usuario.rol === "ADMIN" ? "Panel de Admin" : usuario.rol === "EMPLEADO" ? "Panel de Empleado" : "Portal Estudiantil"}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.showBadge && cantidadCarrito > 0 && (
                    <SidebarMenuBadge>
                      <Badge variant="default" className="size-5 justify-center p-0 text-[10px]">
                        {cantidadCarrito}
                      </Badge>
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/perfil"} tooltip="Mi Perfil">
              <Link href="/perfil" className="flex items-center gap-3">
                <Avatar className="size-7">
                  <AvatarImage src={usuario.avatar} alt={usuario.nombre} />
                  <AvatarFallback className="text-xs">
                    {usuario.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium truncate max-w-[140px]">
                    {usuario.nombre}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                    {getRoleLabel()}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Cerrar Sesión" 
              className="text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
