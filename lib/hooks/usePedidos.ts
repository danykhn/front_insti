'use client';

import { useState, useCallback } from 'react';
import pedidosService, { Pedido } from '@/lib/api/pedidosService';
import { useStore } from '@/lib/store';

export function usePedidos() {
  const [isLoading, setIsLoading] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cargarPedidos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await pedidosService.getPedidos();
      setPedidos(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar pedidos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const crearPedido = useCallback(
    async (metodoPago: string, observaciones?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const carrito = useStore.getState().carrito;
        
        const articulos = carrito.map((item) => ({
          cartillaId: item.cartilla.id,
          cantidad: item.cantidad,
        }));

        if (articulos.length === 0) {
          throw new Error('El carrito está vacío');
        }

        const pedido = await pedidosService.crearPedido({
          articulos,
          metodo_pago: metodoPago,
          observaciones,
        });

        // Vaciar carrito después de crear pedido
        useStore.getState().vaciarCarrito();

        setPedidos([pedido, ...pedidos]);
        return pedido;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al crear pedido';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pedidos]
  );

  return {
    pedidos,
    isLoading,
    error,
    cargarPedidos,
    crearPedido,
  };
}
