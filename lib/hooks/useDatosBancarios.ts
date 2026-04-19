import { useState, useEffect } from 'react';
import datosBancariosService, { DatosBancarios } from '@/lib/api/datosBancariosService';
import authService from '@/lib/auth/authService';

export function useDatosBancarios() {
  const [datos, setDatos] = useState<DatosBancarios | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) return;

    datosBancariosService.setToken(token);
    
    const fetchDatos = async () => {
      try {
        setLoading(true);
        let activo;
        try {
          activo = await datosBancariosService.getActivo();
        } catch {
          try {
            const all = await datosBancariosService.getAll();
            activo = all?.find((d: any) => d.isActive) || null;
          } catch {
            activo = null;
          }
        }
        setDatos(activo);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, []);

  return { datos, loading, error };
}