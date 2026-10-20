const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, apiRequest, getAdminToken, getAuthToken } = require('./helpers');

describe('Admin Functions & Security Controls Test Suite (Black Box & White Box)', () => {
  let adminToken;
  let userToken;

  before(async () => {
    await startServer();
    adminToken = await getAdminToken();
    userToken = await getAuthToken('regular.user@pust.ac.bd', 'alumni');
  });

  after(async () => {
    await stopServer();
  });

  test('TC-SEC-01 [Headers]: Verifies security HTTP headers on all API responses', async () => {
    const res = await apiRequest('/api/health');
    assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
    assert.strictEqual(res.headers.get('x-frame-options'), 'SAMEORIGIN');
    assert.strictEqual(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  });

  test('TC-SEC-02 [404 Routing]: Returns structured 404 JSON for nonexistent API routes', async () => {
    const res = await apiRequest('/api/nonexistent/endpoint');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /not found/i);
  });

  test('TC-SEC-03 [Malformed Input]: Graceful 400 error handling on malformed JSON payload', async () => {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"email": "broken-json-string',
    });
    assert.strictEqual(res.status, 400);
  });

  test('TC-SEC-04 [Auth Guard]: Unauthenticated request to /api/admin/verifications rejected with 401', async () => {
    const res = await apiRequest('/api/admin/verifications');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /Authentication required/i);
  });

  test('TC-SEC-04b [Auth Guard]: Forged or malformed Bearer token rejected with 401', async () => {
    const res = await apiRequest('/api/admin/verifications', {
      headers: { Authorization: 'Bearer forged.tampered.jwttoken' },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /Invalid or expired authentication token/i);
  });

  test('TC-SEC-05 [Role Guard]: Non-admin user request to /api/admin/verifications rejected with 403', async () => {
    const res = await apiRequest('/api/admin/verifications', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /Forbidden/i);
  });

  test('TC-SEC-06 [Role Guard]: Unauthorized & non-admin DELETE /api/events/:id rejected', async () => {
    // Unauthenticated
    const resUnauth = await apiRequest('/api/events/1', { method: 'DELETE' });
    assert.strictEqual(resUnauth.status, 401);

    // Non-admin user
    const resUser = await apiRequest('/api/events/1', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(resUser.status, 403);
  });

  test('TC-SEC-07 [Role Guard]: Unauthorized & non-admin DELETE /api/jobs/:id rejected', async () => {
    // Unauthenticated
    const resUnauth = await apiRequest('/api/jobs/1', { method: 'DELETE' });
    assert.strictEqual(resUnauth.status, 401);

    // Non-admin user
    const resUser = await apiRequest('/api/jobs/1', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(resUser.status, 403);
  });

  test('TC-SEC-08 [Data Privacy]: Unauthenticated GET /api/contact rejected with 401', async () => {
    const res = await apiRequest('/api/contact');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.ok, false);
  });

  test('TC-ADM-01 [Positive]: GET /api/admin/verifications returns verification requests for admin', async () => {
    const res = await apiRequest('/api/admin/verifications', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.ok(Array.isArray(res.data.data));
  });

  test('TC-ADM-02 [Positive]: PATCH /api/admin/verifications/:id updates verification status', async () => {
    const listRes = await apiRequest('/api/admin/verifications', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.ok(listRes.data.data.length > 0);
    const targetItem = listRes.data.data[0];

    const patchRes = await apiRequest(`/api/admin/verifications/${targetItem.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'approved' },
    });
    assert.strictEqual(patchRes.status, 200);
    assert.strictEqual(patchRes.data.ok, true);
    assert.strictEqual(patchRes.data.data.status, 'approved');
  });

  test('TC-ADM-03 [Negative]: PATCH /api/admin/verifications/999999 returns 404 for nonexistent id', async () => {
    const res = await apiRequest('/api/admin/verifications/999999', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'rejected' },
    });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.ok, false);
  });

  test('TC-ADM-04 [Positive]: PATCH /api/admin/users/:id updates user record', async () => {
    const patchRes = await apiRequest('/api/admin/users/1', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'active', verified: true },
    });
    assert.strictEqual(patchRes.status, 200);
    assert.strictEqual(patchRes.data.ok, true);
    assert.strictEqual(patchRes.data.data.verified, true);
  });

  test('TC-ADM-05 [Negative]: PATCH /api/admin/users/999999 returns 404 for nonexistent user', async () => {
    const res = await apiRequest('/api/admin/users/999999', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'suspended' },
    });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.ok, false);
  });

  test('TC-ADM-06 [Positive]: DELETE /api/admin/users/:id deletes user record', async () => {
    // First register a throwaway user to delete
    const email = `delete.target.${Date.now()}@pust.ac.bd`;
    const regRes = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Delete Target', email, password: 'Password123' },
    });
    const targetId = regRes.data.user.id;

    const delRes = await apiRequest(`/api/admin/users/${targetId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delRes.data.ok, true);

    const getRes = await apiRequest(`/api/alumni/${targetId}`);
    assert.strictEqual(getRes.status, 404);
  });

  test('TC-ADM-07 [Negative]: DELETE /api/admin/users/999999 returns 404 for nonexistent user', async () => {
    const res = await apiRequest('/api/admin/users/999999', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.ok, false);
  });
});
