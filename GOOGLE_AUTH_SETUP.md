# Google Auth Setup - Guía Rápida para el Frontend

## Estado Actual

✅ **Completado**:
- NextAuth.js instalado y configurado
- Google OAuth Provider configurado
- Custom `useAuth` hook creado
- Página de login actualizada con botón de Google
- Variables de entorno preparadas

---

## Próximos Pasos

### 1. Obtener Credenciales de Google

Ve a [Google Cloud Console](https://console.cloud.google.com/) y:

1. Crea un proyecto OAuth 2.0
2. Añade estos redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `http://localhost:3000` (desarrollo)

3. Copia el **Client ID** y **Client Secret**

### 2. Actualizar `.env.local`

```env
GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret
NEXTAUTH_SECRET=generado-con-openssl
```

### 3. Instalar axios (si no está)

```bash
npm install axios
```

### 4. Probar el Login

```bash
npm run dev
```

Abre `http://localhost:3000/login` y haz clic en el botón de Google.

---

## Uso en Componentes

```typescript
import { useAuth } from '@/lib/auth';

export default function MyComponent() {
  const { user, signIn, signUp, logout, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <p>Bienvenido, {user?.firstName}</p>;
  }

  return <button onClick={() => signIn('email@example.com', 'password')}>Login</button>;
}
```

---

## Endpoints Disponibles

- `POST /auth/signin` - Email/Contraseña
- `POST /auth/signup` - Registro
- `POST /auth/google/login` - Google (para SPAs)
- `GET /api/auth/callback/google` - NextAuth callback

---

## Importante

El código está listo para usar. Solo necesitas configurar las credenciales de Google.
