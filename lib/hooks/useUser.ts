'use client';

import { useState, useCallback } from 'react';
import userService, { User } from '@/lib/api/userService';

export function useUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargarPerfil = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getMe();
      setUser(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar perfil';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const actualizarPerfil = useCallback(async (data: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateProfile(data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar perfil';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    cargarPerfil,
    actualizarPerfil,
  };
}
