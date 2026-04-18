'use client';

import { useState, useCallback } from 'react';
import pagosService, { Pago } from '@/lib/api/pagosService';

export function usePagos() {
  const [isLoading, setIsLoading] = useState(false);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [error, setError] = useState<string | null>(null);

  const cargarPagos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await pagosService.getPagos();
      setPagos(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar pagos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registrarTransferencia = useCallback(
    async (pedidoId: string, id_comprobante: string, fecha_transferencia: string, comprobante_url?: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const pago = await pagosService.registrarTransferencia({
          pedidoId,
          id_comprobante,
          fecha_transferencia,
          comprobante_url,
        });
        setPagos([pago, ...pagos]);
        return pago;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al registrar pago';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pagos]
  );

  const registrarEfectivo = useCallback(
    async (pedidoId: string, entregado_por: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const pago = await pagosService.registrarEfectivo({
          pedidoId,
          entregado_por,
        });
        setPagos([pago, ...pagos]);
        return pago;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Error al registrar pago';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [pagos]
  );

  return {
    pagos,
    isLoading,
    error,
    cargarPagos,
    registrarTransferencia,
    registrarEfectivo,
  };
}
