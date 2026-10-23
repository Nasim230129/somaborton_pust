const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, apiRequest, getAdminToken, getAuthToken } = require('./helpers');

describe('PUST Memories Gallery — 5 Faculties, 21 Departments & 18 Batches Hierarchy Suite', () => {
  let adminToken;
  let verifiedCseToken;
  let eeeStudentToken;

  before(async () => {
    await startServer();
    adminToken = await getAdminToken();

    // Verified CSE alumni user
    verifiedCseToken = getAuthToken({
      id: 20001,
      name: 'CSE Verified Graduate',
      email: 'cse.alumni@pust.ac.bd',
      role: 'alumni',
      dept: 'CSE',
      verified: true,
    });

    // Verified EEE student user
    eeeStudentToken = getAuthToken({
      id: 20002,
      name: 'EEE Current Student',
      email: 'eee.student@pust.ac.bd',
      role: 'student',
      dept: 'EEE',
      verified: true,
    });
  });

  after(async () => {
    await stopServer();
  });

  test('TC-FAC-01: GET /api/faculties returns exactly 5 verified PUST faculties', async () => {
    const res = await apiRequest('/api/faculties');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.strictEqual(res.data.data.length, 5);

    const facultyNames = res.data.data.map((f) => f.name || f.shortName);
    assert.ok(facultyNames.some((n) => n.includes('Engineering & Technology')));
    assert.ok(facultyNames.some((n) => n.includes('Science')));
    assert.ok(facultyNames.some((n) => n.includes('Business Studies')));
    assert.ok(facultyNames.some((n) => n.includes('Humanities & Social Science')));
    assert.ok(facultyNames.some((n) => n.includes('Life & Earth Science')));
  });

  test('TC-DEP-02: GET /api/departments returns all 21 departments correctly partitioned', async () => {
    const allRes = await apiRequest('/api/departments');
    assert.strictEqual(allRes.status, 200);
    assert.strictEqual(allRes.data.data.length, 21);

    // Filter by Faculty of Engineering & Technology
    const engRes = await apiRequest('/api/departments?faculty=Engineering & Technology');
    assert.strictEqual(engRes.status, 200);
    assert.strictEqual(engRes.data.data.length, 7);
    const codes = engRes.data.data.map((d) => d.code);
    assert.ok(codes.includes('CSE'));
    assert.ok(codes.includes('EEE'));
    assert.ok(codes.includes('EECE'));
    assert.ok(codes.includes('ICE'));
    assert.ok(codes.includes('CE'));
    assert.ok(codes.includes('ARCH'));
    assert.ok(codes.includes('URP'));
  });

  test('TC-BAT-01: GET /api/departments/:id/batches returns 18 configured batches per department', async () => {
    const res = await apiRequest('/api/departments/1/batches'); // CSE department
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.strictEqual(res.data.data.length, 18);

    assert.strictEqual(res.data.data[0].label, 'Batch 1');
    assert.strictEqual(res.data.data[0].session, '2008-2009');
    assert.strictEqual(res.data.data[17].label, 'Batch 18');
    assert.strictEqual(res.data.data[17].session, '2025-2026');
  });

  test('TC-SEC-09: User cannot upload to another department without authorization', async () => {
    // EEE student attempts to upload into CSE department
    const crossDeptMemory = {
      title: 'Malicious Cross-Department Injection',
      url: '/assets/1778991184DSC05122-DR5DHwQE.jpeg',
      mediaType: 'photo',
      category: 'Campus Life',
      departmentId: 1, // CSE
      deptCode: 'CSE',
      batch: 'Batch 1',
    };

    const res = await apiRequest('/api/gallery', {
      method: 'POST',
      token: eeeStudentToken,
      body: crossDeptMemory,
    });

    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /Forbidden.*not authorized/i);
  });

  test('TC-SEC-10: Cross-department batch mismatch is strictly rejected', async () => {
    // Attempt to attach an EEE batch (batchId 201) to a CSE department upload
    const mismatchPayload = {
      title: 'CSE Memory with Invalid Foreign Batch',
      url: '/assets/1778991184DSC05122-DR5DHwQE.jpeg',
      mediaType: 'photo',
      category: 'Campus Life',
      departmentId: 1, // CSE
      deptCode: 'CSE',
      batchId: 201, // Belongs to EEE
    };

    const res = await apiRequest('/api/gallery', {
      method: 'POST',
      token: adminToken,
      body: mismatchPayload,
    });

    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /Cross-department violation/i);
  });

  test('TC-PERM-01: Verified department member can upload to own department', async () => {
    const validMemory = {
      title: 'CSE Batch 15 AI Lab Showcase',
      caption: 'Final year neural network robotics display',
      url: '/assets/1778991184DSC05122-DR5DHwQE.jpeg',
      mediaType: 'photo',
      category: 'Department Lab',
      departmentId: 1,
      deptCode: 'CSE',
      batch: 'Batch 15',
    };

    const res = await apiRequest('/api/gallery', {
      method: 'POST',
      token: verifiedCseToken,
      body: validMemory,
    });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.ok, true);
    assert.strictEqual(res.data.data.deptCode, 'CSE');
  });

  test('TC-ACC-01: User can request access to another department and moderator can review', async () => {
    // EEE student requests access to CSE
    const reqRes = await apiRequest('/api/gallery/request-access', {
      method: 'POST',
      token: eeeStudentToken,
      body: {
        departmentId: 1,
        reason: 'Inter-department robotics collaboration photos',
        requestedRole: 'member',
      },
    });

    assert.strictEqual(reqRes.status, 201);
    assert.strictEqual(reqRes.data.ok, true);
    const reqId = reqRes.data.data.id;

    // Admin approves the request
    const reviewRes = await apiRequest(`/api/gallery/access-requests/${reqId}`, {
      method: 'PATCH',
      token: adminToken,
      body: { status: 'approved' },
    });

    assert.strictEqual(reviewRes.status, 200);
    assert.strictEqual(reviewRes.data.ok, true);
    assert.strictEqual(reviewRes.data.data.status, 'approved');

    // Now EEE student CAN upload to CSE
    const postRes = await apiRequest('/api/gallery', {
      method: 'POST',
      token: eeeStudentToken,
      body: {
        title: 'Joint Robotics Club Photo',
        url: '/assets/1778991184DSC05122-DR5DHwQE.jpeg',
        mediaType: 'photo',
        category: 'Campus Life',
        departmentId: 1,
        deptCode: 'CSE',
        batch: 'Batch 16',
      },
    });

    assert.strictEqual(postRes.status, 201);
    assert.strictEqual(postRes.data.ok, true);
  });
});
