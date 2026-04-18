'use client';

import { useState, useCallback, useEffect } from 'react';
import authService, { AuthToken } from './authService';
import { useStore } from '@/lib/store';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<AuthToken['user'] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener las acciones del store
  const setUsuario = useStore((state) => state.setUsuario);
  const storeLogin = useStore((state) => state.login);
  const storeLogout = useStore((state) => state.logout);

  // Verificar si hay sesión activa al montar
  useEffect(() => {
    const token = authService.getToken();
    const savedUser = authService.getUser();
    if (token && savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
      // Usar ID del usuario o email como fallback
      const userId = savedUser.id || savedUser.email || 'temp-' + Date.now();
      // Actualizar el store también
      setUsuario({
        id: userId,
        nombre: `${savedUser.firstName || ''} ${savedUser.lastName || ''}`.trim() || savedUser.email || 'Usuario',
        email: savedUser.email || '',
        telefono: '',
        direccion: '',
        avatar: savedUser.picture || '',
        grado: '',
        institucion: '',
      });
      storeLogin(savedUser.email || '', '');
    }
  }, [setUsuario, storeLogin]);

  const signUp = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await authService.signUp(email, password, firstName, lastName);
        setUser(response.user);
        authService.setUser(response.user);
        setIsAuthenticated(true);
        // Usar ID del usuario o email como fallback
        const userId = response.user.id || response.user.email || 'temp-' + Date.now();
        // Actualizar el store
        setUsuario({
          id: userId,
          nombre: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || email,
          email: response.user.email || email,
          telefono: '',
          direccion: '',
          avatar: response.user.picture || '',
          grado: '',
          institucion: '',
        });
        storeLogin(email, password);
        return response;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Error en el registro';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setUsuario, storeLogin],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.signIn(email, password);
      setUser(response.user);
      authService.setUser(response.user);
      setIsAuthenticated(true);
      // Usar ID del usuario o email como fallback
      const userId = response.user.id || response.user.email || 'temp-' + Date.now();
      // Actualizar el store
      setUsuario({
        id: userId,
        nombre: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || email,
        email: response.user.email || email,
        telefono: '',
        direccion: '',
        avatar: response.user.picture || '',
        grado: '',
        institucion: '',
      });
      storeLogin(email, password);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error en el inicio de sesión';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUsuario, storeLogin]);

  const googleLogin = useCallback(async (profile: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.googleLogin(profile);
      setUser(response.user);
      authService.setUser(response.user);
      setIsAuthenticated(true);
      
      // Usar ID del usuario o generar uno si no existe
      const userId = response.user.id || response.user.email || 'temp-' + Date.now();
      
      // Actualizar el store
      setUsuario({
        id: userId,
        nombre: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || profile.name || 'Usuario',
        email: response.user.email || profile.email || '',
        telefono: '',
        direccion: '',
        avatar: response.user.picture || profile.image || '',
        grado: '',
        institucion: '',
      });
      storeLogin(response.user.email || profile.email || '', '');
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error en el login con Google';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUsuario, storeLogin]);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    // Actualizar el store
    storeLogout();
  }, [storeLogout]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signUp,
    signIn,
    googleLogin,
    logout,
  };
}
