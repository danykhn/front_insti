'use client';

import { useState, useEffect, useCallback } from 'react';
import pedidosService from '@/lib/api/pedidosService';
import authService from '@/lib/auth/authService';

export function useUserPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pedidosService.getPedidos();
      setPedidos(data);
    } catch (err: any) {
      console.log('[useUserPedidos] Error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  // Stats
  const total = pedidos.length;
  const pendientes = pedidos.filter((p: any) => p.estado === 'PENDIENTE').length;
  const pagados = pedidos.filter((p: any) => p.estado === 'PAGADO').length;
  const completados = pedidos.filter((p: any) => p.estado === 'COMPLETADO').length;
  const cancelados = pedidos.filter((p: any) => p.estado === 'CANCELADO').length;
  // En camino = pagados (asumiendo que Pagado = en procesamiento)
  const enCamino = pagados;

  return {
    pedidos,
    loading,
    error,
    total,
    pendientes,
    pagados,
    completados,
    cancelados,
    enCamino,
    recargar: cargarPedidos,
  };
}