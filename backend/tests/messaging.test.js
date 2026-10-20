const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { io } = require('socket.io-client');
const { startServer, stopServer, getBaseUrl, apiRequest, getAuthToken } = require('./helpers');

describe('Messaging & Real-Time Communication Test Suite', () => {
  before(async () => {
    await startServer();
  });

  after(async () => {
    await stopServer();
  });

  const user1Token = getAuthToken({
    id: 1,
    name: 'Dr. Rafiqul Islam',
    email: 'rafiq@example.com',
    role: 'alumni',
  });

  const user2Token = getAuthToken({
    id: 2,
    name: 'Nusrat Jahan Akter',
    email: 'nusrat@example.com',
    role: 'alumni',
  });

  const outsiderToken = getAuthToken({
    id: 9999,
    name: 'Outsider User',
    email: 'outsider@pust.ac.bd',
    role: 'student',
  });

  let sharedConversationId = null;

  test('TC-MSG-AUTH-01: GET /api/conversations requires authentication', async () => {
    const res = await apiRequest('/api/conversations');
    assert.equal(res.status, 401);
    assert.equal(res.data.ok, false);
  });

  test('TC-MSG-LIST-02: GET /api/conversations returns user conversations for participant', async () => {
    const res = await apiRequest('/api/conversations', {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert.equal(res.status, 200);
    assert.equal(res.data.ok, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.length >= 1);
    
    // Check hydrated participant structure
    const firstConv = res.data.data[0];
    assert.ok(firstConv.id);
    assert.ok(firstConv.participant);
    assert.ok(firstConv.participant.name);
    sharedConversationId = firstConv.id;
  });

  test('TC-MSG-SELF-03: POST /api/conversations rejects self-messaging', async () => {
    const res = await apiRequest('/api/conversations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
      body: JSON.stringify({ recipientId: 1 }),
    });
    assert.equal(res.status, 400);
    assert.equal(res.data.ok, false);
    assert.match(res.data.message, /yourself/i);
  });

  test('TC-MSG-RECIPIENT-04: POST /api/conversations rejects nonexistent recipient', async () => {
    const res = await apiRequest('/api/conversations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
      body: JSON.stringify({ recipientId: 8888888 }),
    });
    assert.equal(res.status, 404);
    assert.equal(res.data.ok, false);
  });

  test('TC-MSG-DUP-05: POST /api/conversations prevents duplicate conversations', async () => {
    // Requesting conversation between 1 and 2 should return existing conversation (not create duplicate)
    const res1 = await apiRequest('/api/conversations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
      body: JSON.stringify({ recipientId: 2 }),
    });
    assert.equal(res1.status, 200);
    assert.equal(res1.data.ok, true);
    assert.equal(res1.data.created, false);
    const existingId = res1.data.data.id;

    // Recipient starting conversation back with user 1 should also return exact same conversation ID
    const res2 = await apiRequest('/api/conversations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${user2Token}` },
      body: JSON.stringify({ recipientId: 1 }),
    });
    assert.equal(res2.status, 200);
    assert.equal(res2.data.ok, true);
    assert.equal(res2.data.data.id, existingId);
  });

  test('TC-MSG-SEC-06: Non-participant cannot access private conversation', async () => {
    const res = await apiRequest(`/api/conversations/${sharedConversationId}`, {
      headers: { Authorization: `Bearer ${outsiderToken}` },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.ok, false);
  });

  test('TC-MSG-SEC-07: Non-participant cannot view messages of private conversation', async () => {
    const res = await apiRequest(`/api/conversations/${sharedConversationId}/messages`, {
      headers: { Authorization: `Bearer ${outsiderToken}` },
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.ok, false);
  });

  test('TC-MSG-SEC-08: Non-participant cannot post messages into private conversation', async () => {
    const res = await apiRequest(`/api/conversations/${sharedConversationId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${outsiderToken}` },
      body: JSON.stringify({ text: 'Injected message attempt' }),
    });
    assert.equal(res.status, 403);
    assert.equal(res.data.ok, false);
  });

  test('TC-MSG-VALID-09: Rejects empty or whitespace-only messages', async () => {
    const res = await apiRequest(`/api/conversations/${sharedConversationId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
      body: JSON.stringify({ text: '   ' }),
    });
    assert.equal(res.status, 400);
    assert.equal(res.data.ok, false);
  });

  test('TC-MSG-VALID-10: Rejects oversized messages exceeding 2000 characters', async () => {
    const giantMessage = 'P'.repeat(2001);
    const res = await apiRequest(`/api/conversations/${sharedConversationId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
      body: JSON.stringify({ text: giantMessage }),
    });
    assert.equal(res.status, 400);
    assert.equal(res.data.ok, false);
    assert.match(res.data.message, /2000/);
  });

  test('TC-MSG-SEND-11: Successfully sends and persists message with verified sender', async () => {
    const testText = 'Hello Nusrat, testing official PUST encrypted messaging channel.';
    const res = await apiRequest(`/api/conversations/${sharedConversationId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
      body: JSON.stringify({
        text: testText,
        senderId: 9999, // Injected fake sender ID should be ignored!
      }),
    });

    assert.equal(res.status, 201);
    assert.equal(res.data.ok, true);
    assert.equal(res.data.data.text, testText);
    assert.equal(res.data.data.senderId, 1); // Derived securely from JWT token
    assert.equal(res.data.data.senderName, 'Dr. Rafiqul Islam');
    assert.equal(res.data.data.read, false);
  });

  test('TC-MSG-PAGINATION-12: Retrieves paginated message history', async () => {
    const res = await apiRequest(`/api/conversations/${sharedConversationId}/messages?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${user1Token}` },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.ok, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.length >= 1);
    assert.ok(res.data.pagination);
    assert.equal(res.data.pagination.page, 1);
    assert.equal(res.data.pagination.limit, 10);
  });

  test('TC-MSG-READ-13: PATCH /api/conversations/:id/read marks unread messages as read', async () => {
    // User 2 reads messages from User 1
    const res = await apiRequest(`/api/conversations/${sharedConversationId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${user2Token}` },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.ok, true);

    // Verify conversation list shows 0 unread for User 2
    const convRes = await apiRequest('/api/conversations', {
      headers: { Authorization: `Bearer ${user2Token}` },
    });
    const conv = convRes.data.data.find((c) => c.id === sharedConversationId);
    assert.ok(conv);
    assert.equal(conv.unreadCount, 0);
  });

  test('TC-MSG-ELIGIBLE-14: GET /api/alumni/message-eligible returns available contacts', async () => {
    const res = await apiRequest('/api/alumni/message-eligible', {
      headers: { Authorization: `Bearer ${user1Token}` },
    });

    assert.equal(res.status, 200);
    assert.equal(res.data.ok, true);
    assert.ok(Array.isArray(res.data.data));
    // Must not include user 1 (cannot message self)
    const hasSelf = res.data.data.some((u) => u.id === 1);
    assert.equal(hasSelf, false);
  });

  test('TC-MSG-SOCK-15: Socket.IO connection succeeds with valid JWT auth', async () => {
    const url = getBaseUrl();
    const socket = io(url, {
      auth: { token: user1Token },
      transports: ['websocket'],
    });

    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.disconnect();
        reject(new Error('Socket connection timed out'));
      }, 3000);

      socket.on('connect', () => {
        clearTimeout(timer);
        assert.ok(socket.id);
        socket.disconnect();
        resolve();
      });

      socket.on('connect_error', (err) => {
        clearTimeout(timer);
        socket.disconnect();
        reject(err);
      });
    });
  });

  test('TC-MSG-SOCK-16: Socket.IO connection is rejected without or with invalid JWT', async () => {
    const url = getBaseUrl();
    const socket = io(url, {
      auth: { token: 'invalid_token_xyz' },
      transports: ['websocket'],
    });

    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        socket.disconnect();
        reject(new Error('Expected rejection but timed out'));
      }, 3000);

      socket.on('connect', () => {
        clearTimeout(timer);
        socket.disconnect();
        reject(new Error('Socket connected unexpectedly with invalid token'));
      });

      socket.on('connect_error', (err) => {
        clearTimeout(timer);
        assert.match(err.message, /authentication|token/i);
        socket.disconnect();
        resolve();
      });
    });
  });

  test('TC-MSG-SOCK-17: Socket.IO receives live new_message event in joined conversation room', async () => {
    const url = getBaseUrl();
    const clientUser2 = io(url, {
      auth: { token: user2Token },
      transports: ['websocket'],
    });

    await new Promise((resolve) => clientUser2.on('connect', resolve));

    // Join room for sharedConversationId
    clientUser2.emit('join_conversation', { conversationId: sharedConversationId });

    // Wait brief tick for room join
    await new Promise((r) => setTimeout(r, 100));

    // Setup listener for new_message
    const messagePromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        clientUser2.disconnect();
        reject(new Error('Did not receive live new_message event'));
      }, 4000);

      clientUser2.on('new_message', (payload) => {
        clearTimeout(timer);
        clientUser2.disconnect();
        resolve(payload);
      });
    });

    // User 1 sends message via REST API
    const liveText = 'Live Socket.IO broadcast test';
    await apiRequest(`/api/conversations/${sharedConversationId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
      body: JSON.stringify({ text: liveText }),
    });

    const payload = await messagePromise;
    assert.ok(payload);
    assert.equal(payload.conversationId, sharedConversationId);
    assert.equal(payload.message.text, liveText);
    assert.equal(payload.message.senderId, 1);
  });

  test('TC-MSG-SOCK-18: Socket.IO broadcasts typing indicator to conversation room', async () => {
    const url = getBaseUrl();
    const clientUser1 = io(url, {
      auth: { token: user1Token },
      transports: ['websocket'],
    });
    const clientUser2 = io(url, {
      auth: { token: user2Token },
      transports: ['websocket'],
    });

    await Promise.all([
      new Promise((resolve) => clientUser1.on('connect', resolve)),
      new Promise((resolve) => clientUser2.on('connect', resolve)),
    ]);

    clientUser1.emit('join_conversation', { conversationId: sharedConversationId });
    clientUser2.emit('join_conversation', { conversationId: sharedConversationId });

    await new Promise((r) => setTimeout(r, 100));

    const typingPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        clientUser1.disconnect();
        clientUser2.disconnect();
        reject(new Error('Typing indicator not received'));
      }, 4000);

      clientUser2.on('user_typing', (data) => {
        clearTimeout(timer);
        clientUser1.disconnect();
        clientUser2.disconnect();
        resolve(data);
      });
    });

    clientUser1.emit('typing', { conversationId: sharedConversationId, isTyping: true });

    const typingData = await typingPromise;
    assert.equal(typingData.conversationId, sharedConversationId);
    assert.equal(typingData.userId, 1);
    assert.equal(typingData.isTyping, true);
  });
});
