'use client';

import { useState, useEffect, useCallback } from 'react';
import cartillasService from '@/lib/api/cartillasService';
import authService from '@/lib/auth/authService';

export function useHomeStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stats
  const [cartillasDisponibles, setCartillasDisponibles] = useState(0);
  const [carritoCantidad, setCarritoCantidad] = useState(0);
  const [carritoTotal, setCarritoTotal] = useState(0);
  const [pedidosActivos, setPedidosActivos] = useState(0);
  const [pedidosEntregados, setPedidosEntregados] = useState(0);
  const [pedidosRecientes, setPedidosRecientes] = useState<any[]>([]);
  const [cartillasDestacadas, setCartillasDestacadas] = useState<any[]>([]);

  const cargarStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 1. Cartillas disponibles
      const cartillas = await cartillasService.getCartillas();
      const disponibles = cartillas.filter((c: any) => c.cantidad > 0).length;
      setCartillasDisponibles(disponibles);
      
      // 2. Cartillas destacadas (las primeras 4 disponibles)
      const destacadas = cartillas.filter((c: any) => c.cantidad > 0).slice(0, 4);
      setCartillasDestacadas(destacadas);
      
      // 3. Pedidos del usuario
      try {
        const pedidos = await authService.getUserOrders();
        
        //过滤订单状态
        const activos = pedidos.filter((p: any) => 
          p.estado === 'PENDIENTE' || p.estado === 'PAGADO'
        ).length;
        const entregados = pedidos.filter((p: any) => 
          p.estado === 'COMPLETADO'
        ).length;
        
        setPedidosActivos(activos);
        setPedidosEntregados(entregados);
        setPedidosRecientes(pedidos.slice(0, 5)); // Recent 5 orders
        
      } catch (err) {
        console.log('[HomeStats] Error fetching orders:', err);
      }
      
    } catch (err: any) {
      console.log('[HomeStats] Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const syncCarrito = useCallback(() => {
    // Get from store via authService or localStorage
    const store = require('@/lib/store').useStore.getState();
    const carrito = store.carrito;
    
    const cantidad = carrito.reduce((sum: number, item: any) => sum + (Number(item.cantidad) || 0), 0);
    const total = carrito.reduce((sum: number, item: any) => sum + ((item.cartilla?.precio || 0) * (Number(item.cantidad) || 0)), 0);
    
    setCarritoCantidad(cantidad);
    setCarritoTotal(total);
  }, []);

  useEffect(() => {
    cargarStats();
    syncCarrito();
  }, [cargarStats, syncCarrito]);

  return {
    loading,
    error,
    cartillasDisponibles,
    carritoCantidad,
    carritoTotal,
    pedidosActivos,
    pedidosEntregados,
    pedidosRecientes,
    cartillasDestacadas,
    recargar: cargarStats,
    syncCarrito,
  };
}