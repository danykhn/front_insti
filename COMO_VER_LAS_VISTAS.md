# 🎯 Guía Rápida - Cómo Ver las Diferentes Vistas

## ⚡ En 3 Pasos

### Paso 1️⃣: Abre la aplicación
```
http://localhost:3000
```

### Paso 2️⃣: Busca el banner azul
Verás esto en la página principal:
```
┌─────────────────────────────────────────┐
│ 🔧 Modo de Prueba - Cambiar Rol         │
│ Selecciona un rol para ver las vistas   │
│ correspondientes:                       │
│                                         │
│ [👨‍🎓 CURSANTE] [👨‍💼 ADMIN] [👷 EMPLEADO] │
└─────────────────────────────────────────┘
```

### Paso 3️⃣: Haz clic en un rol
Verás cambios automáticos:
- Cambia el menú del sidebar
- Se actualiza el dashboard
- Aparecen nuevas opciones

---

## 👨‍🎓 CURSANTE - Lo que verás

### Menú Lateral
```
Navegación
├── ✅ Inicio
├── ✅ Catálogo
├── ✅ Carrito (📦 badge)
├── ✅ Mis Pedidos
└── ✅ Pagos
```

### Dashboard Principal
- Estadísticas de compras
- Catálogo destacado
- Últimos pedidos
- Estado del carrito

### Breadcrumb
```
Inicio (seleccionado)
```

---

## 👨‍💼 ADMIN - Lo que verás

### Menú Lateral
```
Navegación
├── ✅ Inicio
├── ✅ Gestión de Usuarios
├── ✅ Gestión de Pedidos
├── ✅ Catálogo
├── ✅ Reportes
└── ✅ Configuración
```

### Dashboard Principal (/admin)
**Tarjetas de Estadísticas:**
- 👥 Total Usuarios (150)
- ⏰ Pedidos Pendientes (ejemplo: 5)
- ✅ Pedidos Completados (ejemplo: 25)
- 💰 Ingresos Totales ($15,500)

**Secciones:**
- Gestión Rápida (4 botones)
- Alertas del Sistema
- Pedidos por Procesar

### Rutas Disponibles
```
/admin                 → Dashboard
/admin/usuarios        → Tabla de usuarios + filtros
/admin/pedidos         → Tabla de pedidos + filtros
/admin/reportes        → Gráficos y estadísticas
/admin/configuracion   → Configuración de sistema
```

**Ejemplo de Gestión de Usuarios (/admin/usuarios):**
```
┌────────────────────────────────────────────────────────┐
│ Gestión de Usuarios                                    │
├────────────────────────────────────────────────────────┤
│ [🔍 Buscar...] [Admin] [Empleado] [Cursante] [Todos] │
├────────────────────────────────────────────────────────┤
│ Nombre    | Email          | Rol      | Estado | Acc   │
│-----------|-----------------|----------|--------|-------|
│ María G.  | maria@...       | CURSANTE | Activo | Edit  │
│ Carlos R. | carlos@...      | EMPLEADO | Activo | Elim. │
│ Ana M.    | ana@...         | ADMIN    | Activo | Edit  │
│ Juan S.   | juan@...        | CURSANTE | Inact. | Edit  │
└────────────────────────────────────────────────────────┘

Estadísticas:
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 3 Cursantes      │ │ 1 Empleado       │ │ 1 Administrador  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## 👷 EMPLEADO - Lo que verás

### Menú Lateral
```
Navegación
├── ✅ Inicio
├── ✅ Gestión de Pedidos
├── ✅ Catálogo
└── ✅ Usuarios
```

### Dashboard Principal (/empleado)
**Tarjetas de Estadísticas:**
- 📦 Pedidos Asignados (10)
- ⏰ Pendientes de Procesar (3)
- 🚚 En Envío (2)
- ✅ Entregados (5)

**Secciones:**
- Acciones Rápidas
- Estado General
- Pedidos Pendientes

### Rutas Disponibles
```
/empleado          → Dashboard
/empleado/pedidos  → Tabla de pedidos + cambio de estado
/empleado/usuarios → Información de clientes
```

**Ejemplo de Gestión de Pedidos (/empleado/pedidos):**
```
┌────────────────────────────────────────────────────────┐
│ Gestión de Pedidos                                     │
├────────────────────────────────────────────────────────┤
│ [🔍 Buscar...] [Todos] [Pendientes] [Enviados] [...]  │
├────────────────────────────────────────────────────────┤
│ ID   │ Items │ Total  │ Estado    │ Cambiar a    │ Act │
│------|-------|--------|-----------|--------------|-----|
│ 001  │ 2     │ $300   │ Pendiente │ [dropdown] ▼ │ 👁️  │
│ 002  │ 1     │ $180   │ Enviado   │ [dropdown] ▼ │ 👁️  │
│ 003  │ 3     │ $450   │ Pendiente │ [dropdown] ▼ │ 👁️  │
└────────────────────────────────────────────────────────┘

Selector de estado (ejemplo):
┌─────────────────┐
│ Pendiente       │
│ Pagado          │
│ Enviado       ← │
│ Entregado       │
│ Cancelado       │
└─────────────────┘
```

---

## 🎨 Colores y Estilos por Estado

### Estados de Pedidos
- 🟠 **Pendiente** (Naranja) - Requiere acción
- 🔵 **Pagado** (Azul) - Confirmado
- 🟣 **Enviado** (Púrpura) - En tránsito
- 🟢 **Entregado** (Verde) - Completado
- 🔴 **Cancelado** (Rojo) - No procesado

### Estados de Usuario
- 🟢 **Activo** (Verde) - Usuario funcionando
- 🟠 **Inactivo** (Naranja) - Usuario deshabilitado

---

## 🔧 Cambiar Rol Alternativo

Si el banner azul no aparece, ve directamente a:
```
http://localhost:3000/perfil
```

Baja en la página y verás una tarjeta amarilla:
```
┌─────────────────────────────────────────┐
│ Cambiar Rol (Testing)                   │
│ Selecciona un rol para ver las vistas   │
├─────────────────────────────────────────┤
│ [👨‍🎓 Ver como Cursante]                 │
│ [👨‍💼 Ver como Admin]                    │
│ [👷 Ver como Empleado]                  │
└─────────────────────────────────────────┘
```

---

## ✨ Qué Cambia en Cada Rol

| Elemento | CURSANTE | ADMIN | EMPLEADO |
|----------|----------|-------|----------|
| Menú | 5 opciones | 6 opciones | 4 opciones |
| Dashboard | 📚 Compras | 📊 Admin | 📦 Pedidos |
| Colores | Azul | Rojo | Púrpura |
| Acciones | Comprar | Gestionar | Procesar |
| Tablas | Mis pedidos | Todos | Asignados |

---

## 📸 Comparación Visual

### Sidebar CURSANTE vs ADMIN vs EMPLEADO

```
CURSANTE           ADMIN              EMPLEADO
┌─────────┐        ┌─────────┐        ┌─────────┐
│ Inicio  │        │ Inicio  │        │ Inicio  │
│ Catálogo│        │ Usuarios│        │ Pedidos │
│ Carrito │        │ Pedidos │        │ Catálogo│
│ Pedidos │        │ Catálogo│        │ Usuarios│
│ Pagos   │        │ Reportes│        └─────────┘
└─────────┘        │ Config. │
                   └─────────┘
```

---

## 🎯 Casos de Uso

### 👨‍🎓 Yo soy CURSANTE, quiero:
1. ✅ Ver catálogo → Click en "Catálogo"
2. ✅ Comprar cartillas → Click en "Carrito"
3. ✅ Ver mis pedidos → Click en "Mis Pedidos"
4. ✅ Editar mi perfil → Click en el avatar

### 👨‍💼 Yo soy ADMIN, quiero:
1. ✅ Gestionar usuarios → Click en "Gestión de Usuarios"
2. ✅ Ver todos los pedidos → Click en "Gestión de Pedidos"
3. ✅ Ver reportes → Click en "Reportes"
4. ✅ Cambiar configuración → Click en "Configuración"

### 👷 Yo soy EMPLEADO, quiero:
1. ✅ Procesar pedidos → Click en "Gestión de Pedidos"
2. ✅ Ver información de clientes → Click en "Usuarios"
3. ✅ Ver catálogo de cartillas → Click en "Catálogo"

---

## 🐛 Si algo no funciona

1. **No veo el banner azul**
   - Abre la página principal (`/`)
   - Recarga la página (Ctrl+F5)
   - Revisa la consola (F12) por errores

2. **El menú no cambia**
   - Verifica que hayas seleccionado un rol
   - Recarga la página
   - Limpia el caché del navegador

3. **Las rutas no existen**
   - Verifica que la ruta sea correcta
   - Ejemplo correcto: `/admin/usuarios`
   - No uses `/admin/usuario` (singular)

4. **Los datos están vacíos**
   - Esto es normal, son datos simulados
   - Serán reemplazados con datos reales del backend

---

## 📚 Documentación Adicional

Para más detalles, consulta:
- `VISTAS_POR_ROL.md` - Guía completa
- `RESUMEN_IMPLEMENTACION.md` - Resumen técnico

---

**¡Listo para explorar las vistas!** 🚀

