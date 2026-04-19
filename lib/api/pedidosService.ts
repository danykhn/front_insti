import axios, { AxiosInstance } from 'axios';

export type PedidoEstado = 'PENDIENTE' | 'PAGADO' | 'COMPLETADO' | 'CANCELADO';
export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';

export interface CartillaInfo {
  id: string;
  titulo: string;
  descripcion: string;
  autor: string;
  materia: string;
  carrera: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export interface ArticuloPedido {
  id?: string;
  pedidoId?: string;
  cartillaId: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
  titulo?: string;
  precio?: number;
  cartilla?: CartillaInfo;
}

export interface Pedido {
  id: string;
  numeroOrden: string;
  usuarioId: string;
  usuario?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  estado: PedidoEstado;
  metodo_pago: MetodoPago;
  cantidad_total: number;
  precio_total: number;
  observaciones: string | null;
  articulos: ArticuloPedido[];
  cartillas?: ArticuloPedido[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePedidoDto {
  articulos: ArticuloPedido[];
  metodo_pago: MetodoPago;
  observaciones?: string;
}

export interface UpdatePedidoEstadoDto {
  estado: PedidoEstado;
  observaciones?: string;
}

export interface PedidosStats {
  total: number;
  pendientes: number;
  pagados: number;
  completados: number;
  cancelados: number;
  ingresosTotales: number;
}

class PedidosService {
  private api: AxiosInstance;
  private token: string = '';

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333') {
    this.api = axios.create({
      baseURL,
      withCredentials: true,
    });
  }

  setToken(token: string): void {
    console.log('[PedidosService] Token seteado:', token?.substring(0, 15));
    this.token = token;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
    };
  }

  async getPedidos(filters?: { usuarioId?: string; estado?: string }): Promise<Pedido[]> {
    const { data } = await this.api.get('/pedidos', { 
      params: filters,
      headers: this.getHeaders() 
    });
    return data;
  }

  async getPedido(id: string): Promise<Pedido> {
    const { data } = await this.api.get(`/pedidos/${id}`, {
      headers: this.getHeaders()
    });
    return data;
  }

  async getStats(): Promise<any> {
    const { data } = await this.api.get('/pedidos/stats', {
      headers: this.getHeaders()
    });
    return data;
  }

  async createPedido(input: CreatePedidoDto): Promise<Pedido> {
    console.log('[PedidosService] createPedido token:', this.getHeaders());
    const { data } = await this.api.post('/pedidos', input, {
      headers: this.getHeaders()
    });
    return data;
  }

  async updateEstado(id: string, input: UpdatePedidoEstadoDto): Promise<Pedido> {
    const { data } = await this.api.patch(`/pedidos/${id}/estado`, input, {
      headers: this.getHeaders()
    });
    return data;
  }

  async deletePedido(id: string): Promise<void> {
    await this.api.delete(`/pedidos/${id}`, {
      headers: this.getHeaders()
    });
  }
}

export default new PedidosService();