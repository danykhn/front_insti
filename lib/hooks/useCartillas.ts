'use client';

import { useState, useCallback } from 'react';
import cartillasService, { Cartilla } from '@/lib/api/cartillasService';

export function useCartillas() {
  const [isLoading, setIsLoading] = useState(false);
  const [cartillas, setCartillas] = useState<Cartilla[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cargarCartillas = useCallback(async (filters?: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cartillasService.getCartillas(filters);
      setCartillas(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar cartillas';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const obtenerCartilla = useCallback(async (id: string) => {
    try {
      return await cartillasService.getCartillaById(id);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener cartilla';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    cartillas,
    isLoading,
    error,
    cargarCartillas,
    obtenerCartilla,
  };
}
