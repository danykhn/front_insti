import axios, { AxiosInstance } from 'axios';
import cartillasService from '@/lib/api/cartillasService';
import pedidosService from '@/lib/api/pedidosService';
import pagosService from '@/lib/api/pagosService';
import userService from '@/lib/api/userService';

export interface AuthToken {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
    role: string;
  };
}

class AuthService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333') {
    this.baseURL = baseURL;
    this.api = axios.create({
      baseURL: this.baseURL,
      withCredentials: true,
    });

    // Agregar el token a los headers si existe
    const token = this.getToken();
    if (token) {
      this.setToken(token);
    }
  }

  /**
   * Registrar un nuevo usuario con email y contraseña
   */
  async signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
      const response = await this.api.post('/auth/signup', {
        email,
        password,
        firstName,
        lastName,
      });
      const data = response.data as AuthToken;
      this.setToken(data.accessToken);
      this.setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Iniciar sesión con email y contraseña
   */
  async signIn(email: string, password: string) {
    try {
      const response = await this.api.post('/auth/signin', {
        email,
        password,
      });
      const data = response.data as AuthToken;
      this.setToken(data.accessToken);
      this.setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Iniciar sesión con Google (para SPAs)
   */
  async googleLogin(profile: any) {
    try {
      // El profile viene de NextAuth/Google
      // Enviamos los datos al backend para crear/actualizar el usuario
      const response = await this.api.post('/auth/google/login', {
        email: profile.email,
        firstName: profile.name?.split(' ')[0] || profile.name || '',
        lastName: profile.name?.split(' ').slice(1).join(' ') || '',
        picture: profile.image || null,
        googleId: profile.id || null,
      });

      // Manejar diferentes formatos de respuesta del backend
      let data: AuthToken;
      const responseData = response.data;
      
      if (responseData.accessToken && responseData.user) {
        // Formato estándar: { accessToken, user }
        data = responseData as AuthToken;
      } else if (responseData.access_token && responseData.user) {
        // Formato con guion bajo: { access_token, user }
        data = {
          accessToken: responseData.access_token,
          user: responseData.user,
        } as AuthToken;
      } else if (responseData.token && responseData.user) {
        // Formato con "token": { token, user }
        data = {
          accessToken: responseData.token,
          user: responseData.user,
        } as AuthToken;
      } else if (responseData.data?.accessToken && responseData.data?.user) {
        // Formato anidado: { data: { accessToken, user } }
        data = responseData.data as AuthToken;
      } else {
        // Formato desconocido - loguear para debugging
        console.error('Formato de respuesta desconocido del backend:', responseData);
        throw new Error('Respuesta del backend en formato no esperado');
      }

      this.setToken(data.accessToken);
      this.setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener el token guardado
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * Guardar el token y establecerlo en todos los servicios
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Establecer token en todos los servicios
      cartillasService.setToken(token);
      pedidosService.setToken(token);
      pagosService.setToken(token);
      userService.setToken(token);
    }
  }

  /**
   * Eliminar el token y cerrar sesión
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      delete this.api.defaults.headers.common['Authorization'];
      
      // Limpiar token en todos los servicios
      userService.clearToken();
    }
  }

  /**
   * Validar si existe un token válido
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Obtener el usuario guardado en localStorage
   */
  getUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }

  /**
   * Guardar datos del usuario
   */
  setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }
}

export default new AuthService();
