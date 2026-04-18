# Vistas por Rol - Sistema de Cartillas

Este documento describe las vistas y funcionalidades disponibles para cada tipo de usuario en el sistema.

## 🔄 Cambiar de Rol (Para Testing)

Hay dos formas de cambiar de rol para probar las diferentes vistas:

### Opción 1: Desde la Página Principal
1. Ve a la página de inicio (`/`)
2. Verás un banner azul con el título "🔧 Modo de Prueba - Cambiar Rol"
3. Haz clic en los botones para cambiar entre: **CURSANTE**, **ADMIN**, **EMPLEADO**

### Opción 2: Desde el Perfil
1. Ve a `/perfil` (o haz clic en tu nombre en el pie del sidebar)
2. Desplázate hacia abajo
3. Encontrarás una tarjeta amarilla "Cambiar Rol (Testing)"
4. Selecciona el rol que deseas probar

---

## 👨‍🎓 Vista CURSANTE (Estudiante)

Esta es la vista predeterminada para estudiantes que compran cartillas.

### Rutas Disponibles
- **`/`** - Página principal (Dashboard del cursante)
- **`/catalogo`** - Catálogo de cartillas disponibles
- **`/carrito`** - Carrito de compras
- **`/pedidos`** - Mis pedidos
- **`/pagos`** - Historial de pagos
- **`/perfil`** - Mi perfil

### Funcionalidades
- ✅ Ver catálogo completo de cartillas
- ✅ Agregar cartillas al carrito
- ✅ Gestionar carrito de compras
- ✅ Crear pedidos
- ✅ Ver estado de pedidos
- ✅ Ver historial de pagos
- ✅ Actualizar información personal

### Menú Lateral
```
Navegación
├── Inicio
├── Catálogo
├── Carrito (con contador)
├── Mis Pedidos
└── Pagos
```

---

## 👨‍💼 Vista ADMIN (Administrador)

Panel de administración completo del sistema con control total.

### Rutas Disponibles
- **`/admin`** - Dashboard principal de administración
- **`/admin/usuarios`** - Gestión de usuarios
- **`/admin/pedidos`** - Gestión de pedidos
- **`/admin/reportes`** - Reportes y análisis
- **`/admin/configuracion`** - Configuración del sistema
- **`/catalogo`** - Ver catálogo

### Funcionalidades
- ✅ Ver estadísticas generales del sistema
- ✅ Crear, editar y eliminar usuarios
- ✅ Filtrar usuarios por rol y estado
- ✅ Ver todos los pedidos del sistema
- ✅ Cambiar estado de pedidos
- ✅ Acceder a reportes y análisis
- ✅ Configurar parámetros de seguridad
- ✅ Gestionar notificaciones
- ✅ Administrar base de datos

### Menú Lateral
```
Navegación
├── Inicio
├── Gestión de Usuarios
├── Gestión de Pedidos
├── Catálogo
├── Reportes
└── Configuración
```

### Dashboard Principal (/admin)
Muestra:
- Total de usuarios (con desglose por estado)
- Pedidos pendientes
- Pedidos completados
- Ingresos totales
- Alertas del sistema
- Últimos pedidos por procesar

### Gestión de Usuarios (/admin/usuarios)
- Tabla de todos los usuarios registrados
- Búsqueda por nombre o email
- Filtrado por rol (ADMIN, EMPLEADO, CURSANTE)
- Edición y eliminación de usuarios
- Estados: Activo/Inactivo
- Estadísticas por tipo de usuario

### Gestión de Pedidos (/admin/pedidos)
- Tabla de todos los pedidos
- Búsqueda por ID
- Filtrado por estado (Pendiente, Pagado, Enviado, Entregado)
- Visualización de detalles
- Estadísticas de pedidos

### Reportes (/admin/reportes)
- Ingresos totales
- Total de pedidos
- Tasa de entrega
- Desglose de pedidos por estado
- Información de período actual

### Configuración (/admin/configuracion)
- Configuración de seguridad
- Gestión de notificaciones
- Opciones de base de datos
- Información del sistema

---

## 👷 Vista EMPLEADO (Empleado)

Panel para empleados que procesan y gestionan pedidos.

### Rutas Disponibles
- **`/empleado`** - Dashboard principal del empleado
- **`/empleado/pedidos`** - Gestión de pedidos asignados
- **`/empleado/usuarios`** - Ver información de clientes
- **`/catalogo`** - Ver catálogo

### Funcionalidades
- ✅ Ver pedidos asignados
- ✅ Cambiar estado de pedidos
- ✅ Procesar pedidos (Pendiente → Pagado → Enviado → Entregado)
- ✅ Visualizar información de clientes
- ✅ Ver detalles de pedidos
- ✅ Acceder al catálogo

### Menú Lateral
```
Navegación
├── Inicio
├── Gestión de Pedidos
├── Catálogo
└── Usuarios
```

### Dashboard Principal (/empleado)
Muestra:
- Total de pedidos asignados
- Pedidos pendientes de procesar
- Pedidos en envío
- Pedidos entregados
- Acciones rápidas
- Lista de pedidos pendientes

### Gestión de Pedidos (/empleado/pedidos)
- Tabla de pedidos asignados
- Búsqueda por ID
- Filtrado por estado
- Selector desplegable para cambiar estado
- Estadísticas de pedidos

### Usuarios (/empleado/usuarios)
- Información de clientes (cursantes)
- Búsqueda por nombre o email
- Vista de contacto
- Estado de clientes
- Información de registro

---

## 📊 Flujo de Cambio de Estado de Pedidos

El flujo típico de un pedido es:

```
PENDIENTE → PAGADO → ENVIADO → ENTREGADO
```

Estados posibles:
- **Pendiente**: Pedido recibido, esperando procesamiento
- **Pagado**: Pago confirmado
- **Enviado**: Pedido en tránsito
- **Entregado**: Pedido entregado al cliente
- **Cancelado**: Pedido cancelado (en cualquier momento)

---

## 🔐 Controles de Acceso

El sistema implementa control de roles automático:

| Ruta | CURSANTE | ADMIN | EMPLEADO |
|------|----------|-------|----------|
| `/` | ✅ | ↪️ /admin | ↪️ /empleado |
| `/admin/*` | ❌ | ✅ | ❌ |
| `/empleado/*` | ❌ | ❌ | ✅ |
| `/catalogo` | ✅ | ✅ | ✅ |
| `/perfil` | ✅ | ✅ | ✅ |

Legend:
- ✅ Acceso permitido
- ❌ Acceso bloqueado (redirige a `/`)
- ↪️ Redirección automática

---

## 🔄 Cambio de Rol en Producción

**Nota**: Los botones de cambio de rol en la interfaz son **solo para testing**. 

En producción, el rol se determina desde el backend mediante:
1. **Autenticación JWT** - El token contiene el rol del usuario
2. **Base de datos** - El rol se almacena en el perfil del usuario
3. **AuthService** - El servicio de autenticación recupera el rol del token

Para cambiar roles en producción, edita el usuario en la base de datos o a través del panel de administración.

---

## 📝 Implementación Técnica

### Ubicación de las Vistas

```
app/
├── admin/
│   ├── page.tsx                    # Dashboard ADMIN
│   ├── usuarios/page.tsx           # Gestión de usuarios
│   ├── pedidos/page.tsx            # Gestión de pedidos
│   ├── reportes/page.tsx           # Reportes
│   └── configuracion/page.tsx      # Configuración
├── empleado/
│   ├── page.tsx                    # Dashboard EMPLEADO
│   ├── pedidos/page.tsx            # Gestión de pedidos
│   └── usuarios/page.tsx           # Ver usuarios
├── page.tsx                        # Página principal con selector de rol
├── catalogo/page.tsx               # Catálogo
├── carrito/page.tsx                # Carrito
├── pedidos/page.tsx                # Pedidos
├── pagos/page.tsx                  # Pagos
└── perfil/page.tsx                 # Perfil con selector de rol
```

### Store (Zustand)

El estado global se maneja con Zustand en `lib/store.ts`:

```typescript
interface Usuario {
  id: string
  nombre: string
  email: string
  rol: "CURSANTE" | "ADMIN" | "EMPLEADO"
  // ... otros campos
}

// Función para cambiar el rol
setRol: (rol: "CURSANTE" | "ADMIN" | "EMPLEADO") => void
```

### Sidebar Dinámico

El componente `AppSidebar` (`components/app-sidebar.tsx`) muestra diferentes menús según el rol:

```typescript
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
```

---

## 🚀 Próximos Pasos

1. **Integración con Backend**
   - Conectar con endpoints reales del backend
   - Implementar autenticación JWT real
   - Sincronizar datos de usuarios con API

2. **Protección de Rutas**
   - Implementar guards para rutas protegidas
   - Validar rol antes de acceder a rutas
   - Redirigir acceso no autorizado

3. **Persistencia**
   - Guardar rol en localStorage/sessionStorage
   - Sincronizar con API en cada cambio
   - Implementar refresh de datos

4. **Mejoras UI**
   - Componentes específicos por rol
   - Temas visuales diferenciados
   - Animaciones de transición entre roles

---

## 📞 Soporte

Para problemas o preguntas sobre las vistas:
1. Revisa la consola del navegador para errores
2. Verifica que estés usando el rol correcto
3. Intenta cambiar de rol y vuelve a intentar
4. Revisa los logs del backend

