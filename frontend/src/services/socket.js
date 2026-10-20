import { io } from 'socket.io-client';

let socket = null;

// Determine socket URL: prefer explicit env var, or backend port 5000 in dev, or current origin
const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
    window.location.port !== '5000'
  ) {
    return 'http://localhost:5000';
  }
  return typeof window !== 'undefined' ? window.location.origin : '';
};

export function getSocket() {
  if (socket && socket.connected) {
    return socket;
  }
  return initSocket();
}

export function initSocket() {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('pust_token') : null;

  if (socket) {
    // If token changed or socket disconnected, re-auth
    if (token && (!socket.auth || socket.auth.token !== token)) {
      socket.auth = { token };
      if (socket.connected) {
        socket.disconnect();
      }
      socket.connect();
    }
    return socket;
  }

  const url = getSocketUrl();
  socket = io(url, {
    auth: { token: token || '' },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    autoConnect: true,
  });

  socket.on('connect', () => {
    // socket connected
  });

  socket.on('disconnect', (reason) => {
    // socket disconnected
  });

  socket.on('connect_error', (err) => {
    // Fallback gracefully without breaking UI
    console.debug('Socket connection notice:', err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    try {
      socket.disconnect();
    } catch (e) {
      // ignore
    }
    socket = null;
  }
}

export function joinConversation(conversationId) {
  if (!conversationId) return;
  const s = getSocket();
  if (s) {
    s.emit('join_conversation', { conversationId: Number(conversationId) });
  }
}

export function leaveConversation(conversationId) {
  if (!conversationId) return;
  const s = getSocket();
  if (s) {
    s.emit('leave_conversation', { conversationId: Number(conversationId) });
  }
}

export function emitTyping(conversationId, isTyping) {
  if (!conversationId) return;
  const s = getSocket();
  if (s) {
    s.emit('typing', { conversationId: Number(conversationId), isTyping: Boolean(isTyping) });
  }
}
