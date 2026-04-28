export type MetodoPago = 'TRANSFERENCIA' | 'EFECTIVO' | 'MERCADO_PAGO';

export interface Pedido {
  id: string;
  numeroOrden: string;
  usuarioId: string;
  estado: 'PENDIENTE' | 'PAGADO' | 'COMPLETADO' | 'CANCELADO';
  metodo_pago: MetodoPago;
  cantidad_total: number;
  precio_total: number;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatosBancarios {
  id: string;
  alias: string;
  cbu: string;
  numeroCuenta: string;
  titular: string;
  nombreBanco: string;
  isActive: boolean;
}

export interface OrdenMercadoPago {
  id: string;
  status: 'created' | 'processing' | 'processed' | 'cancelled';
  external_reference: string;
  preference_id: string;
  payer_email?: string;
  items: {
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }[];
  total_amount: number;
  status_detail?: string;
  init_point?: string;
  point_of_interaction?: {
    url?: string;
  };
}

export interface CreateOrdenResponse {
  id: string;
  status: string;
  preference_id?: string;
  init_point?: string;
  point_of_interaction?: {
    url?: string;
  };
  [key: string]: any;
}

export interface PaymentMethods {
  TRANSFERENCIA: string;
  EFECTIVO: string;
  MERCADO_PAGO: string;
}

export const PAYMENT_METHODS: PaymentMethods = {
  TRANSFERENCIA: 'Transferencia Bancaria',
  EFECTIVO: 'Efectivo',
  MERCADO_PAGO: 'Mercado Pago'
};