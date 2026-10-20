const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, apiRequest } = require('./helpers');

describe('Authentication & Registration Test Suite (Black Box & White Box)', () => {
  before(async () => {
    await startServer();
  });

  after(async () => {
    await stopServer();
  });

  test('TC-API-01: Health check returns service status and db metadata', async () => {
    const res = await apiRequest('/api/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.ok(res.data.database);
    assert.strictEqual(res.data.database.connected, true);
  });

  test('TC-AUTH-01 [Positive]: Register new alumni user with valid fields', async () => {
    const uniqueEmail = `test.alumni.${Date.now()}@pust.ac.bd`;
    const payload = {
      name: 'Shahriar Kabir',
      email: uniqueEmail,
      password: 'SecurePassword123!',
      role: 'alumni',
      dept: 'Computer Science & Engineering',
      batch: '2019',
    };

    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: payload,
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.ok, true);
    assert.ok(res.data.token, 'Token must be provided upon registration');
    assert.strictEqual(res.data.user.name, 'Shahriar Kabir');
    assert.strictEqual(res.data.user.email, uniqueEmail);
    assert.strictEqual(res.data.user.password, undefined, 'Password must never be returned in response');
  });

  test('TC-AUTH-02 [Negative]: Registration fails with empty name or email', async () => {
    const resNoName = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: '', email: 'valid@pust.ac.bd', password: 'Password123' },
    });
    assert.strictEqual(resNoName.status, 400);
    assert.strictEqual(resNoName.data.ok, false);

    const resNoEmail = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Valid Name', email: '', password: 'Password123' },
    });
    assert.strictEqual(resNoEmail.status, 400);
    assert.strictEqual(resNoEmail.data.ok, false);
  });

  test('TC-AUTH-03 [Negative]: Registration fails with invalid email format', async () => {
    const invalidEmails = ['invalid-email', 'user@', '@pust.ac.bd', 'user@domain'];
    for (const email of invalidEmails) {
      const res = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: { name: 'Test User', email, password: 'Password123' },
      });
      assert.strictEqual(res.status, 400, `Expected 400 for email: ${email}`);
      assert.strictEqual(res.data.ok, false);
    }
  });

  test('TC-AUTH-04 [Boundary]: Registration fails with password shorter than 6 characters', async () => {
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Short Pass User',
        email: `shortpass.${Date.now()}@pust.ac.bd`,
        password: '12345', // 5 chars
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /at least 6 characters/i);
  });

  test('TC-AUTH-05 [Negative]: Registration fails with duplicate email', async () => {
    const duplicateEmail = `duplicate.${Date.now()}@pust.ac.bd`;
    const payload = {
      name: 'Original User',
      email: duplicateEmail,
      password: 'StrongPassword123',
    };

    const firstRes = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: payload,
    });
    assert.strictEqual(firstRes.status, 201);

    const dupRes = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Second User',
        email: duplicateEmail,
        password: 'DifferentPassword123',
      },
    });
    assert.strictEqual(dupRes.status, 400);
    assert.strictEqual(dupRes.data.ok, false);
    assert.match(dupRes.data.message, /already registered/i);
  });

  test('TC-AUTH-06 [Positive]: Login succeeds with correct registered credentials', async () => {
    const email = `login.test.${Date.now()}@pust.ac.bd`;
    const password = 'MySecretPassword2026!';

    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Login Tester', email, password },
    });

    const loginRes = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    assert.strictEqual(loginRes.status, 200);
    assert.strictEqual(loginRes.data.ok, true);
    assert.ok(loginRes.data.token);
    assert.strictEqual(loginRes.data.user.email, email);
    assert.strictEqual(loginRes.data.user.password, undefined);
  });

  test('TC-AUTH-07 [Negative]: Login fails with wrong password for registered user', async () => {
    const email = `wrongpass.${Date.now()}@pust.ac.bd`;
    const correctPassword = 'CorrectPassword123!';

    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Pass Tester', email, password: correctPassword },
    });

    const loginRes = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password: 'WrongPassword999!' },
    });

    assert.strictEqual(loginRes.status, 401);
    assert.strictEqual(loginRes.data.ok, false);
    assert.match(loginRes.data.message, /invalid credentials/i);
  });

  test('TC-AUTH-08 [Negative]: Login fails when email is missing or empty', async () => {
    const loginRes = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: '', password: 'SomePassword' },
    });

    assert.strictEqual(loginRes.status, 400);
    assert.strictEqual(loginRes.data.ok, false);
  });

  test('TC-AUTH-09 [Negative/Security]: Login fails when email does not exist in database', async () => {
    const nonexistentEmail = `nonexistent.user.${Date.now()}@pust.ac.bd`;
    const loginRes = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: nonexistentEmail, password: 'RandomPassword123!' },
    });

    assert.strictEqual(loginRes.status, 401, 'Nonexistent user must be rejected with 401');
    assert.strictEqual(loginRes.data.ok, false);
    assert.match(loginRes.data.message, /invalid credentials/i);
  });

  test('TC-AUTH-10 [Positive]: Reset password successfully and log in with new password', async () => {
    const email = `reset.tester.${Date.now()}@pust.ac.bd`;
    const originalPassword = 'OriginalPass123!';
    const newPassword = 'NewSecretPassword2026!';

    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Reset User', email, password: originalPassword },
    });

    const resetRes = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { email, newPassword },
    });

    assert.strictEqual(resetRes.status, 200);
    assert.strictEqual(resetRes.data.ok, true);
    assert.match(resetRes.data.message, /successfully reset/i);

    // Verify login succeeds with the new password
    const loginRes = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password: newPassword },
    });

    assert.strictEqual(loginRes.status, 200);
    assert.strictEqual(loginRes.data.ok, true);
    assert.ok(loginRes.data.token);
  });

  test('TC-AUTH-11 [Negative]: Reset password fails with password shorter than 6 characters', async () => {
    const res = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { email: 'any@pust.ac.bd', newPassword: '123' },
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /at least 6 characters/i);
  });

  test('TC-AUTH-12 [Negative]: Reset password fails for unregistered email', async () => {
    const nonexistentEmail = `unregistered.${Date.now()}@pust.ac.bd`;
    const res = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { email: nonexistentEmail, newPassword: 'NewValidPassword123' },
    });

    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /no registered user/i);
  });
});

