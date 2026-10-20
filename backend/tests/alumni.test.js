const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, apiRequest, getAuthToken } = require('./helpers');

describe('Alumni Directory & Profile Test Suite (Black Box & White Box)', () => {
  before(async () => {
    await startServer();
  });

  after(async () => {
    await stopServer();
  });

  test('TC-ALM-01 [Positive]: GET /api/alumni returns all alumni list', async () => {
    const res = await apiRequest('/api/alumni');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.count >= 0);
  });

  test('TC-ALM-02 [Privacy]: Public alumni list masks email addresses', async () => {
    const res = await apiRequest('/api/alumni');
    assert.strictEqual(res.status, 200);
    const alumniWithEmail = res.data.data.filter((u) => u.email);
    assert.ok(alumniWithEmail.length > 0, 'Should have alumni with email');
    for (const u of alumniWithEmail) {
      assert.ok(u.email.includes('***'), `Email ${u.email} should be masked with asterisks`);
      assert.strictEqual(u.password, undefined, 'Password must never be returned');
    }
  });

  test('TC-ALM-03 [Search]: Case-insensitive search by name', async () => {
    const resUpper = await apiRequest('/api/alumni?search=RAFIQUL');
    assert.strictEqual(resUpper.status, 200);
    assert.ok(resUpper.data.data.length > 0);
    assert.ok(resUpper.data.data.some((u) => u.name.includes('Rafiqul')));

    const resLower = await apiRequest('/api/alumni?search=rafiqul');
    assert.strictEqual(resLower.status, 200);
    assert.strictEqual(resUpper.data.data.length, resLower.data.data.length);
  });

  test('TC-ALM-04 [Search/Boundary]: Search with nonexistent keyword returns empty list', async () => {
    const res = await apiRequest('/api/alumni?search=NonExistentAlumniXYZ123456');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.count, 0);
    assert.deepStrictEqual(res.data.data, []);
  });

  test('TC-ALM-05 [Search/Boundary]: Search with special characters and long string', async () => {
    const longSpecial = "!@#$%^&*()_+-=[]{}|;':,.<>?/`~".repeat(3);
    const res = await apiRequest(`/api/alumni?search=${encodeURIComponent(longSpecial)}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
  });

  test('TC-ALM-06 [Filter]: Filter by Department and Batch', async () => {
    const res = await apiRequest('/api/alumni?dept=Computer%20Science%20%26%20Engineering');
    assert.strictEqual(res.status, 200);
    for (const u of res.data.data) {
      assert.strictEqual(u.dept, 'Computer Science & Engineering');
    }
  });

  test('TC-ALM-07 [Filter]: Filter by Mentor availability', async () => {
    const res = await apiRequest('/api/alumni?mentor=true');
    assert.strictEqual(res.status, 200);
    for (const u of res.data.data) {
      assert.strictEqual(u.mentorAvailable, true);
    }
  });

  test('TC-ALM-08 [Profile/Positive]: GET /api/alumni/:id returns single member details', async () => {
    const res = await apiRequest('/api/alumni/1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.strictEqual(res.data.data.id, 1);
    assert.strictEqual(res.data.data.password, undefined);
  });

  test('TC-ALM-09 [Profile/Negative]: GET /api/alumni/:id returns 404 for nonexistent id', async () => {
    const res = await apiRequest('/api/alumni/99999999');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /member not found/i);
  });

  test('TC-ALM-10 [Profile/Auth]: Authenticated request receives unmasked email', async () => {
    const token = getAuthToken({ id: 1, role: 'alumni' });
    const res = await apiRequest('/api/alumni/1', {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.email, 'Email should be present');
    assert.ok(!res.data.data.email.includes('***'), 'Authenticated user should see unmasked email');
  });

  test('TC-ALM-11 [Positive]: POST /api/alumni/:id/connect increments connection count', async () => {
    const profileBefore = await apiRequest('/api/alumni/1');
    const initialConnections = profileBefore.data.data.connections || 0;

    const res = await apiRequest('/api/alumni/1/connect', { method: 'POST' });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);

    const profileAfter = await apiRequest('/api/alumni/1');
    assert.strictEqual(profileAfter.data.data.connections, initialConnections + 1);
  });

  test('TC-ALM-12 [Pagination & Sorting]: GET /api/alumni supports page & limit parameters', async () => {
    const res = await apiRequest('/api/alumni?page=1&limit=3');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.strictEqual(res.data.data.length, 3);
    assert.strictEqual(res.data.page, 1);
    assert.strictEqual(res.data.limit, 3);
    assert.ok(res.data.totalPages >= 1);
  });

  test('TC-ALM-13 [Filters]: GET /api/alumni filters by verified status and industry', async () => {
    const resVerified = await apiRequest('/api/alumni?verified=true');
    assert.strictEqual(resVerified.status, 200);
    for (const u of resVerified.data.data) {
      assert.strictEqual(u.verified, true);
    }

    const resTech = await apiRequest('/api/alumni?industry=Technology');
    assert.strictEqual(resTech.status, 200);
    for (const u of resTech.data.data) {
      assert.strictEqual(u.industry, 'Technology');
    }
  });

  test('TC-ALM-14 [Bookmarks]: POST /api/alumni/:id/save toggles bookmark state', async () => {
    const token = getAuthToken({ id: 1, role: 'alumni', email: 'rafiq@example.com' });
    const resSave = await apiRequest('/api/alumni/2/save', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.strictEqual(resSave.status, 200);
    assert.strictEqual(resSave.data.ok, true);
    assert.strictEqual(typeof resSave.data.saved, 'boolean');
  });

  test('TC-ALM-15 [Report]: POST /api/alumni/:id/report submits profile violation report', async () => {
    const resInvalid = await apiRequest('/api/alumni/1/report', {
      method: 'POST',
      body: JSON.stringify({ reason: '' }),
    });
    assert.strictEqual(resInvalid.status, 400);

    const resValid = await apiRequest('/api/alumni/1/report', {
      method: 'POST',
      body: JSON.stringify({
        reason: 'Impersonation or inaccurate credentials',
        details: 'Testing alumni reporting endpoint verification.',
        reporterEmail: 'test@example.com',
      }),
    });
    assert.strictEqual(resValid.status, 201);
    assert.strictEqual(resValid.data.ok, true);
    assert.strictEqual(resValid.data.data.targetId, 1);
  });
});

