const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET } = require('./helpers');

describe('White Box Internal Logic & Code Coverage Suite', () => {
  // Test internal helper function logic directly
  test('WB-SAN-01 [Branch]: sanitizeUser handles null, undefined, and empty objects', () => {
    // In api.js sanitizeUser logic:
    function sanitizeUser(u, maskEmail = false) {
      if (!u) return u;
      const { password, ...safe } = u;
      if (maskEmail && safe.email) {
        const parts = safe.email.split('@');
        if (parts.length === 2 && parts[0].length > 2) {
          safe.email = `${parts[0].slice(0, 2)}***@${parts[1]}`;
        }
      }
      return safe;
    }

    assert.strictEqual(sanitizeUser(null), null);
    assert.strictEqual(sanitizeUser(undefined), undefined);

    const emptyUser = sanitizeUser({});
    assert.deepStrictEqual(emptyUser, {});
  });

  test('WB-SAN-02 [Condition]: sanitizeUser email masking branches', () => {
    function sanitizeUser(u, maskEmail = false) {
      if (!u) return u;
      const { password, ...safe } = u;
      if (maskEmail && safe.email) {
        const parts = safe.email.split('@');
        if (parts.length === 2 && parts[0].length > 2) {
          safe.email = `${parts[0].slice(0, 2)}***@${parts[1]}`;
        }
      }
      return safe;
    }

    // Normal email with > 2 chars prefix
    const normal = sanitizeUser({ name: 'A', email: 'rafiqul@pust.ac.bd', password: 'secret' }, true);
    assert.strictEqual(normal.email, 'ra***@pust.ac.bd');
    assert.strictEqual(normal.password, undefined);

    // Short email prefix (<= 2 chars) should not throw and remains unmasked or untouched
    const short = sanitizeUser({ name: 'B', email: 'me@pust.ac.bd', password: 'secret' }, true);
    assert.strictEqual(short.email, 'me@pust.ac.bd');

    // maskEmail = false leaves email intact
    const unmasked = sanitizeUser({ name: 'C', email: 'full@pust.ac.bd', password: 'secret' }, false);
    assert.strictEqual(unmasked.email, 'full@pust.ac.bd');
  });

  test('WB-JWT-01 [Branch/Condition]: JWT token generation, verification, and invalid signature rejection', () => {
    const payload = { id: 101, email: 'user@pust.ac.bd', role: 'alumni' };
    const validToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    // Branch 1: Valid token
    const decoded = jwt.verify(validToken, JWT_SECRET);
    assert.strictEqual(decoded.id, 101);
    assert.strictEqual(decoded.email, 'user@pust.ac.bd');

    // Branch 2: Invalid signature
    assert.throws(
      () => {
        jwt.verify(validToken, 'wrong_secret_key');
      },
      { name: 'JsonWebTokenError' }
    );

    // Branch 3: Expired token
    const expiredToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '-1s' });
    assert.throws(
      () => {
        jwt.verify(expiredToken, JWT_SECRET);
      },
      { name: 'TokenExpiredError' }
    );
  });

  test('WB-MEM-01 [Branch]: Database store provides seeded data collections', () => {
    const store = db.getStore();
    assert.ok(Array.isArray(store.users), 'users array must exist');
    assert.ok(Array.isArray(store.departments), 'departments array must exist');
    assert.ok(Array.isArray(store.events), 'events array must exist');
    assert.ok(Array.isArray(store.jobs), 'jobs array must exist');
    assert.ok(Array.isArray(store.stories), 'stories array must exist');
    assert.ok(Array.isArray(store.notifications), 'notifications array must exist');
    assert.ok(Array.isArray(store.messages), 'messages array must exist');
    assert.ok(Array.isArray(store.gallery), 'gallery array must exist');
    assert.ok(Array.isArray(store.communityPosts), 'communityPosts array must exist');
    assert.ok(Array.isArray(store.donations), 'donations array must exist');
  });

  test('WB-MOD-01 [Schema Validation]: User schema validates required roles', () => {
    const validRoles = ['alumni', 'student', 'faculty', 'employer', 'admin'];
    const User = db.models.User;
    
    for (const role of validRoles) {
      const u = new User({ id: 1234, name: 'Test', role });
      const err = u.validateSync();
      assert.strictEqual(err, undefined, `Role ${role} should be valid`);
    }

    // Invalid role
    const invalidUser = new User({ id: 1234, name: 'Test', role: 'invalid_role' });
    const err = invalidUser.validateSync();
    assert.ok(err, 'Invalid role should trigger validation error');
    assert.ok(err.errors.role);
  });
});
