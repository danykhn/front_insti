import axios, { AxiosInstance } from 'axios';

export interface Cartilla {
  id: string;
  titulo: string;
  descripcion: string;
  autor: string;
  materia: string;
  carrera: string;
  precio: number;
  cantidad: number;
  imagen: string;
  etiquetas?: Array<{
    id: string;
    nombre: string;
  }>;
  createdAt: string;
}

class CartillasService {
  private api: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333') {
    this.api = axios.create({
      baseURL: baseURL,
      withCredentials: true,
    });
  }

  /**
   * Obtener todas las cartillas con filtros opcionales
   */
  async getCartillas(filters?: {
    materia?: string;
    carrera?: string;
    autor?: string;
    etiqueta?: string;
  }) {
    try {
      const response = await this.api.get('/cartillas', { params: filters });
      return response.data as Cartilla[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener cartilla por ID
   */
  async getCartillaById(id: string) {
    try {
      const response = await this.api.get(`/cartillas/${id}`);
      return response.data as Cartilla;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener etiquetas
   */
  async getEtiquetas() {
    try {
      const response = await this.api.get('/cartillas/etiquetas');
      return response.data;
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
}

export default new CartillasService();
