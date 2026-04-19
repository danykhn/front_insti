import { io, Socket } from 'socket.io-client';
import { useStore } from './store';

class WebSocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    const store = useStore.getState();
    const token = store.accessToken;

    if (!token) {
      console.log('[WS] No hay token, no se conecta');
      return;
    }

    if (this.socket?.connected) {
      console.log('[WS] Ya conectado');
      return;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3333';

    this.socket = io(wsUrl, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('[WS] Conectado al servidor WebSocket');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[WS] Desconectado:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.log('[WS] Error de conexión:', error.message);
      this.reconnectAttempts++;
    });

    // Eventos de Pedidos
    this.socket.on('nuevo_pedido', (data) => {
      console.log('[WS] Nuevo pedido:', data);
      useStore.getState().setNotificacion({
        tipo: 'success',
        mensaje: `Nuevo pedido #${data.pedido?.numeroOrden || data.pedido?.id}`,
      });
      // Recargar pedidos si estamos en esa vista
      useStore.getState().refreshPedidos?.();
    });

    this.socket.on('cambio_estado_pedido', (data) => {
      console.log('[WS] Cambio estado pedido:', data);
      useStore.getState().setNotificacion({
        tipo: 'info',
        mensaje: `Pedido #${data.numeroOrden} ahora está ${data.nuevoEstado}`,
      });
      useStore.getState().refreshPedidos?.();
    });

    this.socket.on('actualizar_pedido', (data) => {
      console.log('[WS] Actualizar pedido:', data);
      useStore.getState().refreshPedidos?.();
    });

    // Suscribirse a todos los pedidos (admin/empleado)
    this.suscribirseTodos();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscriptions: string[] = [];

  subscribeToPedido(pedidoId: string) {
    if (this.socket?.connected && !this.subscriptions.includes(pedidoId)) {
      this.socket.emit('suscribirse_pedido', { pedidoId });
      this.subscriptions.push(pedidoId);
    }
  }

  subscribeToAll() {
    if (this.socket?.connected) {
      this.socket.emit('suscribirse_todos_pedidos');
    }
  }

  unsubscribeFromPedido(pedidoId: string) {
    this.subscriptions = this.subscriptions.filter(id => id !== pedidoId);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Singleton
const wsClient = new WebSocketClient();

export default wsClient;

// Hook para usar WebSocket en componentes
export function useWebSocket() {
  return wsClient;
}