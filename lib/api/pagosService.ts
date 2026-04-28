import axios, { AxiosInstance } from 'axios';
import type { CreateOrdenResponse } from '@/types/payment';

export interface Pago {
  id: string;
  pedidoId: string;
  usuarioId: string;
  metodo: 'TRANSFERENCIA' | 'EFECTIVO';
  monto: number;
  estado: 'pendiente' | 'verificado' | 'rechazado';
  comprobante_url?: string;
  id_comprobante?: string;
  fecha_transferencia?: string;
  entregado_por?: string;
  fecha_recepcion?: string;
  createdAt: string;
}

class PagosService {
  private api: AxiosInstance;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333') {
    this.api = axios.create({
      baseURL: baseURL,
      withCredentials: true,
    });
  }

  /**
   * Obtener todos los pagos del usuario
   */
  async getPagos(filters?: {
    estado?: string;
  }) {
    try {
      const response = await this.api.get('/pagos', { params: filters });
      return response.data as Pago[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtener pago por ID
   */
  async getPagoById(id: string) {
    try {
      const response = await this.api.get(`/pagos/${id}`);
      return response.data as Pago;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Registrar pago por transferencia
   */
  async registrarTransferencia(data: {
    pedidoId: string;
    id_comprobante: string;
    fecha_transferencia: string;
    comprobante_url?: string;
  }) {
    try {
      const response = await this.api.post('/pagos/transferencia', data);
      return response.data as Pago;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Registrar pago en efectivo
   */
  async registrarEfectivo(data: {
    pedidoId: string;
    entregado_por: string;
  }) {
    try {
      const response = await this.api.post('/pagos/efectivo', data);
      return response.data as Pago;
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

  // ========== MERCADO PAGO ==========

  /**
   * Crear orden de pago con Mercado Pago
   */
  async crearOrdenMercadoPago(
    pedidoId: string,
    paymentMethodId?: string,
    installments?: number
  ): Promise<CreateOrdenResponse> {
    try {
      const response = await this.api.post('/mercadopago/crear-orden', {
        pedidoId,
        paymentMethodId,
        installments,
      });
      return response.data as CreateOrdenResponse;
    } catch (error) {
      console.error('[PagosService] Error creating MercadoPago order:', error);
      throw error;
    }
  }

  /**
   * Obtener estado de una orden de Mercado Pago
   */
  async obtenerOrdenMercadoPago(orderId: string) {
    try {
      const response = await this.api.get(`/mercadopago/obtener-orden/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('[PagosService] Error getting order:', error);
      throw error;
    }
  }

  /**
   * Cancelar una orden de Mercado Pago
   */
  async cancelarOrdenMercadoPago(orderId: string) {
    try {
      const response = await this.api.post(`/mercadopago/cancelar-orden/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('[PagosService] Error canceling order:', error);
      throw error;
    }
  }

  /**
   * Webhook de Mercado Pago (solo para el backend)
   */
  async procesarWebhook(data: any) {
    try {
      const response = await this.api.post('/mercadopago/webhook', data);
      return response.data;
    } catch (error) {
      console.error('[PagosService] Error processing webhook:', error);
      throw error;
    }
  }
}

export default new PagosService();
