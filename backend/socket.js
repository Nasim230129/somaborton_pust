const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const db = require('./config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'pust_somaborton_alumni_network_secret_key_2026';

let io = null;
const userSockets = new Map(); // userId -> Set of socket.id

function initSocket(httpServer) {
  if (io) return io;

  io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => callback(null, true),
      credentials: true,
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // JWT Authentication Middleware for WebSockets
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
        socket.handshake.query?.token;

      if (!token) {
        return next(new Error('Authentication required: Missing JWT token.'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded || !decoded.id) {
        return next(new Error('Authentication failed: Invalid token payload.'));
      }

      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    const userId = Number(socket.user.id);

    // Track user socket ID
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    // Join personal user room for direct notifications
    socket.join(`user_${userId}`);

    // Broadcast online status if this is the user's first active tab
    if (userSockets.get(userId).size === 1) {
      io.emit('user_status_changed', { userId, online: true });
    }

    // Join authorized conversation room
    socket.on('join_conversation', async ({ conversationId }) => {
      try {
        const cId = Number(conversationId);
        if (!cId) return;

        // Verify user is a participant
        let isParticipant = false;
        if (db.isMongo()) {
          const conv = await db.models.Conversation.findOne({ id: cId }).lean();
          if (conv && conv.participants.map(Number).includes(userId)) {
            isParticipant = true;
          }
        } else {
          const store = db.getStore();
          const conv = (store.conversations || []).find((c) => c.id === cId);
          if (conv && conv.participants.map(Number).includes(userId)) {
            isParticipant = true;
          }
        }

        if (isParticipant) {
          socket.join(`conversation_${cId}`);
        }
      } catch (err) {
        console.debug('Error in join_conversation:', err.message);
      }
    });

    // Leave conversation room
    socket.on('leave_conversation', ({ conversationId }) => {
      const cId = Number(conversationId);
      if (cId) {
        socket.leave(`conversation_${cId}`);
      }
    });

    // Typing indicators
    socket.on('typing', ({ conversationId, isTyping }) => {
      const cId = Number(conversationId);
      if (cId) {
        const flag = isTyping !== undefined ? Boolean(isTyping) : true;
        socket.to(`conversation_${cId}`).emit('user_typing', {
          conversationId: cId,
          userId,
          name: socket.user.name,
          isTyping: flag,
        });
      }
    });

    socket.on('stop_typing', ({ conversationId }) => {
      const cId = Number(conversationId);
      if (cId) {
        socket.to(`conversation_${cId}`).emit('user_typing', {
          conversationId: cId,
          userId,
          name: socket.user.name,
          isTyping: false,
        });
        socket.to(`conversation_${cId}`).emit('user_stop_typing', {
          conversationId: cId,
          userId,
        });
      }
    });

    // Disconnect handling
    socket.on('disconnect', () => {
      const userSet = userSockets.get(userId);
      if (userSet) {
        userSet.delete(socket.id);
        if (userSet.size === 0) {
          userSockets.delete(userId);
          io.emit('user_status_changed', { userId, online: false });
        }
      }
    });
  });

  return io;
}

function getIO() {
  return io;
}

function emitToConversation(conversationId, event, data) {
  if (io) {
    io.to(`conversation_${conversationId}`).emit(event, data);
  }
}

function emitToUser(userId, event, data) {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
}

function isUserOnline(userId) {
  const set = userSockets.get(Number(userId));
  return Boolean(set && set.size > 0);
}

module.exports = {
  initSocket,
  getIO,
  emitToConversation,
  emitToUser,
  isUserOnline,
};
