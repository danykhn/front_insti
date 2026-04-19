'use client';

import { useState, useCallback } from 'react';
import pedidosService from '@/lib/api/pedidosService';
import authService from '@/lib/auth/authService';
import { useStore } from '@/lib/store';
import type { CreatePedidoDto } from '@/lib/api/pedidosService';

export function usePedidos() {
  const [isLoading, setIsLoading] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cargarPedidos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // authService.setToken ya está seteado desde el login
      const data = await pedidosService.getPedidos();
      setPedidos(data);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Error al cargar pedidos';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearPedido = useCallback(async (metodoPago: string, observaciones?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('[usePedidos] Carrito:', useStore.getState().carrito);
      
      // Verificar que authService tenga token
      const hasToken = authService.hasValidToken();
      console.log('[usePedidos] authService tiene token:', hasToken);
      
      if (!hasToken) {
        throw new Error('No hay sesión activa. Por favor, inicia sesión nuevamente.');
      }

      const carrito = useStore.getState().carrito;
      
      const articulos = carrito.map((item: any) => ({
        cartillaId: item.cartilla.id,
        cantidad: Number(item.cantidad) || 1,
      }));

      if (articulos.length === 0) {
        throw new Error('El carrito está vacío');
      }

      const dto: CreatePedidoDto = {
        articulos,
        metodo_pago: metodoPago as any,
        observaciones,
      };

      console.log('[usePedidos] Creando pedido con dto:', dto);

      // Ver el token que se envía
      const token = authService.getToken();
      console.log('[usePedidos] Token a enviar:', token?.substring(0, 30));
      
      const pedido = await pedidosService.createPedido(dto);

      useStore.getState().vaciarCarrito();

      setPedidos([pedido, ...pedidos]);
      return pedido;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Error al crear pedido';
      console.error('[usePedidos] Error:', message);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    pedidos,
    isLoading,
    error,
    cargarPedidos,
    crearPedido,
  };
}