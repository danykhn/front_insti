import axios, { AxiosInstance } from 'axios';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

class UserService {
  private api: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333') {
    this.api = axios.create({
      baseURL: baseURL,
      withCredentials: true,
    });
  }

  /**
   * Obtener perfil del usuario actual
   */
  async getMe() {
    try {
      // Obtener el ID del usuario del localStorage
      const userData = localStorage.getItem('user_data');
      if (!userData) {
        throw new Error('No user data found');
      }
      const user = JSON.parse(userData);
      
      const response = await this.api.get(`/users/${user.id}`);
      return response.data as User;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(id: string) {
    try {
      const response = await this.api.get(`/users/${id}`);
      return response.data as User;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateProfile(data: Partial<User>) {
    try {
      const userData = localStorage.getItem('user_data');
      if (!userData) {
        throw new Error('No user data found');
      }
      const user = JSON.parse(userData);
      
      const response = await this.api.patch(`/users/${user.id}`, data);
      const updatedUser = response.data as User;
      
      // Actualizar localStorage
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Establecer token de autenticación
   */
  setToken(token: string): void {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Limpiar token de autenticación
   */
  clearToken(): void {
    delete this.api.defaults.headers.common['Authorization'];
  }
}

export default new UserService();
