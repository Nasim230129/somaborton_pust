const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, apiRequest, getAdminToken } = require('./helpers');

describe('Events and Jobs Test Suite (Black Box & White Box)', () => {
  let adminToken;

  before(async () => {
    await startServer();
    adminToken = await getAdminToken();
  });

  after(async () => {
    await stopServer();
  });

  // --- EVENTS ---
  test('TC-EVT-01 [Positive]: GET /api/events returns event list', async () => {
    const res = await apiRequest('/api/events');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.ok(Array.isArray(res.data.data));
  });

  test('TC-EVT-02 [Positive]: POST /api/events creates a new event', async () => {
    const newEvent = {
      title: 'PUST Grand Reunion 2026',
      date: 'Dec 25, 2026',
      time: '09:00 AM',
      location: 'PUST Campus, Pabna',
      type: 'Reunion',
      spots: 1000,
    };
    const res = await apiRequest('/api/events', {
      method: 'POST',
      body: newEvent,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.ok, true);
    assert.strictEqual(res.data.data.title, newEvent.title);
    assert.strictEqual(res.data.data.location, newEvent.location);
  });

  test('TC-EVT-03 [Positive]: POST /api/events/:id/register registers user and increments counter', async () => {
    const listRes = await apiRequest('/api/events');
    assert.ok(listRes.data.data.length > 0);
    const targetEvent = listRes.data.data[0];
    const initialRegistered = targetEvent.registered || 0;

    const regRes = await apiRequest(`/api/events/${targetEvent.id}/register`, {
      method: 'POST',
    });
    assert.strictEqual(regRes.status, 200);
    assert.strictEqual(regRes.data.ok, true);

    const afterList = await apiRequest('/api/events');
    const updated = afterList.data.data.find((e) => e.id === targetEvent.id);
    assert.strictEqual(updated.registered, initialRegistered + 1);
  });

  test('TC-EVT-04 [Positive]: DELETE /api/events/:id removes event when authorized', async () => {
    // Create an event to delete
    const createRes = await apiRequest('/api/events', {
      method: 'POST',
      body: { title: 'Temporary Event to Delete', date: 'Jan 1, 2027', location: 'Hall' },
    });
    const createdId = createRes.data.data.id;

    const delRes = await apiRequest(`/api/events/${createdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delRes.data.ok, true);

    const listAfter = await apiRequest('/api/events');
    assert.ok(!listAfter.data.data.some((e) => e.id === createdId));
  });

  test('TC-EVT-05 [Negative/Validation]: POST /api/events fails with 400 when required fields are missing', async () => {
    const res = await apiRequest('/api/events', {
      method: 'POST',
      body: { title: 'Missing date and location' },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /required/i);
  });

  test('TC-EVT-06 [Negative]: POST /api/events/999999/register returns 404 for nonexistent event', async () => {
    const res = await apiRequest('/api/events/999999/register', { method: 'POST' });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.ok, false);
  });

  // --- JOBS ---
  test('TC-JOB-01 [Positive]: GET /api/jobs returns jobs list', async () => {
    const res = await apiRequest('/api/jobs');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.ok(Array.isArray(res.data.data));
  });

  test('TC-JOB-02 [Positive]: POST /api/jobs creates a new job posting', async () => {
    const jobPayload = {
      title: 'Lead Cloud Architect',
      company: 'Brain Station 23',
      location: 'Dhaka, Bangladesh',
      type: 'Full-time',
      salary: '৳ 1,20,000–1,80,000/mo',
      dept: 'CSE',
      skills: ['AWS', 'Kubernetes', 'Node.js'],
      remote: true,
    };
    const res = await apiRequest('/api/jobs', {
      method: 'POST',
      body: jobPayload,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.ok, true);
    assert.strictEqual(res.data.data.title, jobPayload.title);
    assert.strictEqual(res.data.data.company, jobPayload.company);
  });

  test('TC-JOB-03 [Positive]: POST /api/jobs/:id/apply submits application and increments applicant count', async () => {
    const listRes = await apiRequest('/api/jobs');
    assert.ok(listRes.data.data.length > 0);
    const targetJob = listRes.data.data[0];
    const initialApplicants = targetJob.applicants || 0;

    const applyRes = await apiRequest(`/api/jobs/${targetJob.id}/apply`, {
      method: 'POST',
    });
    assert.strictEqual(applyRes.status, 200);
    assert.strictEqual(applyRes.data.ok, true);

    const afterList = await apiRequest('/api/jobs');
    const updated = afterList.data.data.find((j) => j.id === targetJob.id);
    assert.strictEqual(updated.applicants, initialApplicants + 1);
  });

  test('TC-JOB-04 [Positive]: PATCH /api/jobs/:id updates job posting', async () => {
    const listRes = await apiRequest('/api/jobs');
    const targetJob = listRes.data.data[0];

    const patchRes = await apiRequest(`/api/jobs/${targetJob.id}`, {
      method: 'PATCH',
      body: { salary: '৳ 1,50,000/mo', remote: false },
    });
    assert.strictEqual(patchRes.status, 200);
    assert.strictEqual(patchRes.data.ok, true);
    assert.strictEqual(patchRes.data.data.salary, '৳ 1,50,000/mo');
  });

  test('TC-JOB-05 [Positive]: DELETE /api/jobs/:id deletes job posting when authorized', async () => {
    const createRes = await apiRequest('/api/jobs', {
      method: 'POST',
      body: { title: 'Temp Job to Delete', company: 'Test Company' },
    });
    const createdId = createRes.data.data.id;

    const delRes = await apiRequest(`/api/jobs/${createdId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delRes.data.ok, true);

    const listAfter = await apiRequest('/api/jobs');
    assert.ok(!listAfter.data.data.some((j) => j.id === createdId));
  });

  test('TC-JOB-06 [Negative/Validation]: POST /api/jobs fails with 400 when title or company is missing', async () => {
    const res = await apiRequest('/api/jobs', {
      method: 'POST',
      body: { title: 'Only Title Given' },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /required/i);
  });

  test('TC-JOB-07 [Negative]: POST /api/jobs/999999/apply returns 404 for nonexistent job', async () => {
    const res = await apiRequest('/api/jobs/999999/apply', { method: 'POST' });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.ok, false);
  });

  test('TC-JOB-08 [Negative]: PATCH /api/jobs/999999 returns 404 for nonexistent job', async () => {
    const res = await apiRequest('/api/jobs/999999', {
      method: 'PATCH',
      body: { salary: '৳ 1,00,000/mo' },
    });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.ok, false);
  });
});
