import axios, { AxiosInstance } from 'axios';

export interface ArticuloPedido {
  cartillaId: string;
  cantidad: number;
}

export interface ItemPedido extends ArticuloPedido {
  precio_unitario: number;
  subtotal: number;
  cartilla: {
    id: string;
    titulo: string;
  };
}

export interface Pedido {
  id: string;
  numeroOrden: string;
  usuarioId: string;
  estado: 'PENDIENTE' | 'COMPLETADO' | 'CANCELADO' | 'PAGADO';
  metodo_pago: string;
  cantidad_total: number;
  precio_total: number;
  observaciones?: string;
  cartillas: ItemPedido[];
  createdAt: string;
}

class PedidosService {
  private api: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333') {
    this.api = axios.create({
      baseURL: baseURL,
      withCredentials: true,
    });
  }

  /**
   * Obtener todos los pedidos del usuario
   */
  async getPedidos(filters?: {
    estado?: string;
  }) {
    try {
      const response = await this.api.get('/pedidos', { params: filters });
      return response.data as Pedido[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener pedido por ID
   */
  async getPedidoById(id: string) {
    try {
      const response = await this.api.get(`/pedidos/${id}`);
      return response.data as Pedido;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Crear un nuevo pedido
   */
  async crearPedido(data: {
    articulos: ArticuloPedido[];
    metodo_pago: string;
    observaciones?: string;
  }) {
    try {
      const response = await this.api.post('/pedidos', data);
      return response.data as Pedido;
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

export default new PedidosService();
