'use client';

import { useState, useCallback } from 'react';
import pagosService from '@/lib/api/pagosService';
import authService from '@/lib/auth/authService';
import type { CreateOrdenResponse } from '@/types/payment';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearOrdenMercadoPago = useCallback(async (pedidoId: string): Promise<CreateOrdenResponse> => {
    setLoading(true);
    setError(null);
    try {
      const token = authService.getToken();
      if (token) {
        pagosService.setToken(token);
      }
      const order = await pagosService.crearOrdenMercadoPago(pedidoId);
      return order;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Error al crear orden de pago';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verificarEstadoPago = useCallback(async (orderId: string) => {
    try {
      const token = authService.getToken();
      if (token) {
        pagosService.setToken(token);
      }
      const order = await pagosService.obtenerOrdenMercadoPago(orderId);
      return order;
    } catch (err) {
      console.error('Error al verificar estado:', err);
      throw err;
    }
  }, []);

  const cancelarOrden = useCallback(async (orderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = authService.getToken();
      if (token) {
        pagosService.setToken(token);
      }
      const result = await pagosService.cancelarOrdenMercadoPago(orderId);
      return result;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Error al cancelar orden';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const obtenerUrlPago = useCallback((order: CreateOrdenResponse): string | null => {
    return order.init_point || order.point_of_interaction?.url || null;
  }, []);

  return {
    loading,
    error,
    crearOrdenMercadoPago,
    verificarEstadoPago,
    cancelarOrden,
    obtenerUrlPago,
  };
}