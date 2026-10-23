const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, stopServer, apiRequest, getAdminToken } = require('./helpers');

describe('Full Platform Features Test Suite (Stories, Gallery, Community, Donations, Contact, Notifications)', () => {
  let adminToken;

  before(async () => {
    await startServer();
    adminToken = await getAdminToken();
  });

  after(async () => {
    await stopServer();
  });

  test('TC-BST-01 [Positive]: GET /api/bootstrap hydrates full frontend state', async () => {
    const res = await apiRequest('/api/bootstrap');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.ok(Array.isArray(res.data.alumni));
    assert.ok(Array.isArray(res.data.students));
    assert.ok(Array.isArray(res.data.departments));
    assert.ok(Array.isArray(res.data.events));
    assert.ok(Array.isArray(res.data.jobs));
    assert.ok(Array.isArray(res.data.stories));
  });

  test('TC-DEP-01 [Positive]: GET /api/departments returns academic departments list', async () => {
    const res = await apiRequest('/api/departments');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.data.length >= 8, 'PUST should have at least 8 departments');
  });

  test('TC-STY-01 [Positive]: GET & POST /api/stories', async () => {
    const listRes = await apiRequest('/api/stories');
    assert.strictEqual(listRes.status, 200);
    assert.ok(Array.isArray(listRes.data.data));

    const newStory = {
      title: 'From PUST to Silicon Valley',
      category: 'Career Journey',
      excerpt: 'My journey from Pabna to leading cloud architecture.',
      content: 'Detailed inspiring content of graduate...',
    };
    const createRes = await apiRequest('/api/stories', {
      method: 'POST',
      body: newStory,
    });
    assert.strictEqual(createRes.status, 201);
    assert.strictEqual(createRes.data.ok, true);
    assert.strictEqual(createRes.data.data.title, newStory.title);
  });

  test('TC-GAL-01 [Positive]: GET /api/gallery & POST /api/gallery/:id/like', async () => {
    const listRes = await apiRequest('/api/gallery');
    assert.strictEqual(listRes.status, 200);
    assert.ok(Array.isArray(listRes.data.data));
    assert.ok(listRes.data.data.length > 0);

    const targetItem = listRes.data.data[0];
    const initialLikes = targetItem.likes || 0;

    const likeRes = await apiRequest(`/api/gallery/${targetItem.id}/like`, { method: 'POST' });
    assert.strictEqual(likeRes.status, 200);
    assert.strictEqual(likeRes.data.ok, true);

    const afterList = await apiRequest('/api/gallery');
    const updated = afterList.data.data.find((g) => g.id === targetItem.id);
    assert.strictEqual(updated.likes, initialLikes + 1);
  });

  test('TC-GAL-02 [Negative]: POST /api/gallery/999999/like returns 404 for nonexistent photo', async () => {
    const res = await apiRequest('/api/gallery/999999/like', { method: 'POST' });
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.data.ok, false);
    assert.match(res.data.message, /not found/i);
  });

  test('TC-GAL-03 [Positive]: POST /api/gallery adds department photo/video & comment', async () => {
    const newItem = {
      title: 'CSE AI & Robotics Lab Session 2026',
      url: '/assets/1778991184DSC05122-DR5DHwQE.jpeg',
      mediaType: 'photo',
      category: 'Research',
      dept: 'Computer Science & Engineering',
      deptCode: 'CSE',
      faculty: 'Engineering & Technology',
      description: 'Hands-on training session on embedded neural networks.',
      uploader: {
        id: 1,
        name: 'Dr. Rafiqul Islam',
        role: 'alumni',
        dept: 'CSE',
      },
    };

    const createRes = await apiRequest('/api/gallery', {
      method: 'POST',
      token: adminToken,
      body: newItem,
    });
    assert.strictEqual(createRes.status, 201);
    assert.strictEqual(createRes.data.ok, true);
    assert.strictEqual(createRes.data.data.title, newItem.title);
    assert.strictEqual(createRes.data.data.deptCode, 'CSE');

    const createdId = createRes.data.data.id;

    // Filter query test
    const filterRes = await apiRequest('/api/gallery?dept=CSE');
    assert.strictEqual(filterRes.status, 200);
    assert.ok(filterRes.data.data.some((item) => item.id === createdId));

    // Comment test
    const commentRes = await apiRequest(`/api/gallery/${createdId}/comment`, {
      method: 'POST',
      body: {
        text: 'Proud to see our robotics lab advancing so much!',
        user: { name: 'Ariful Islam', role: 'student', dept: 'CSE' },
      },
    });
    assert.strictEqual(commentRes.status, 200);
    assert.strictEqual(commentRes.data.ok, true);
    assert.ok(commentRes.data.data.comments.length > 0);
  });

  test('TC-COM-01 [Positive]: GET & POST /api/community posts', async () => {
    const listRes = await apiRequest('/api/community');
    assert.strictEqual(listRes.status, 200);
    assert.ok(Array.isArray(listRes.data.data));

    const postPayload = {
      channel: 'CSE & Tech Alumni',
      title: 'Tech Meetup in Dhaka 2026',
      body: 'Calling all PUSTians in software engineering for a networking meetup.',
      tags: ['Networking', 'Tech'],
    };
    const createRes = await apiRequest('/api/community', {
      method: 'POST',
      body: postPayload,
    });
    assert.strictEqual(createRes.status, 201);
    assert.strictEqual(createRes.data.ok, true);
    assert.strictEqual(createRes.data.data.title, postPayload.title);
  });

  test('TC-MEN-01 [Positive]: GET /api/mentorship & POST /api/mentorship/request', async () => {
    const getRes = await apiRequest('/api/mentorship');
    assert.strictEqual(getRes.status, 200);
    assert.ok(Array.isArray(getRes.data.mentors));
    assert.ok(Array.isArray(getRes.data.requests));

    const requestPayload = {
      mentorId: 1,
      mentorName: 'Dr. Rafiqul Islam',
      menteeName: 'Sakib Hasan',
      menteeEmail: 'sakib@pust.ac.bd',
      dept: 'CSE',
      batch: '2023',
      topic: 'Career Guidance in Cloud Computing',
    };
    const reqRes = await apiRequest('/api/mentorship/request', {
      method: 'POST',
      body: requestPayload,
    });
    assert.strictEqual(reqRes.status, 201);
    assert.strictEqual(reqRes.data.ok, true);
    assert.strictEqual(reqRes.data.data.status, 'pending');
  });

  test('TC-DON-01 [Positive]: GET /api/donations & POST /api/donations with valid contribution', async () => {
    const listRes = await apiRequest('/api/donations');
    assert.strictEqual(listRes.status, 200);
    assert.ok(Array.isArray(listRes.data.data));

    const donationPayload = {
      campaign: 'Merit Scholarship Fund',
      amount: 10000,
      donorName: 'Anonymous Donor',
      paymentMethod: 'bKash',
      anonymous: true,
      message: 'Keep supporting bright minds.',
    };
    const donRes = await apiRequest('/api/donations', {
      method: 'POST',
      body: donationPayload,
    });
    assert.strictEqual(donRes.status, 201);
    assert.strictEqual(donRes.data.ok, true);
    assert.strictEqual(donRes.data.data.amount, 10000);
    assert.strictEqual(donRes.data.data.donorName, 'Anonymous Alumni');
  });

  test('TC-DON-02 [Negative/Boundary]: POST /api/donations rejects non-positive or invalid amounts with 400', async () => {
    const zeroRes = await apiRequest('/api/donations', {
      method: 'POST',
      body: { amount: 0, campaign: 'Merit Scholarship Fund' },
    });
    assert.strictEqual(zeroRes.status, 400);
    assert.strictEqual(zeroRes.data.ok, false);

    const negativeRes = await apiRequest('/api/donations', {
      method: 'POST',
      body: { amount: -500, campaign: 'Merit Scholarship Fund' },
    });
    assert.strictEqual(negativeRes.status, 400);

    const nanRes = await apiRequest('/api/donations', {
      method: 'POST',
      body: { amount: 'invalid-number', campaign: 'Merit Scholarship Fund' },
    });
    assert.strictEqual(nanRes.status, 400);
  });

  test('TC-CNT-01 [Positive]: POST /api/contact sends inquiry message', async () => {
    const msgPayload = {
      name: 'Farhan Tanvir',
      email: 'farhan@example.com',
      subject: 'Transcript Inquiry',
      message: 'How can I collect my verified official transcript from PUST Registrar office?',
    };
    const res = await apiRequest('/api/contact', {
      method: 'POST',
      body: msgPayload,
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.ok, true);
    assert.strictEqual(res.data.data.name, msgPayload.name);
    assert.strictEqual(res.data.data.status, 'unread');
  });

  test('TC-CNT-02 [Negative]: POST /api/contact validates required fields and email formatting', async () => {
    // Missing message
    const missingRes = await apiRequest('/api/contact', {
      method: 'POST',
      body: { name: 'Farhan', email: 'farhan@example.com' },
    });
    assert.strictEqual(missingRes.status, 400);
    assert.strictEqual(missingRes.data.ok, false);

    // Invalid email
    const invalidEmailRes = await apiRequest('/api/contact', {
      method: 'POST',
      body: { name: 'Farhan', email: 'notanemail', message: 'Hello PUST' },
    });
    assert.strictEqual(invalidEmailRes.status, 400);
    assert.match(invalidEmailRes.data.message, /valid email/i);
  });

  test('TC-CNT-03 [Positive]: GET /api/contact retrieves messages when authenticated as admin', async () => {
    const res = await apiRequest('/api/contact', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.ok, true);
    assert.ok(Array.isArray(res.data.data));
  });

  test('TC-NOT-01 [Positive]: GET /api/notifications & PATCH /api/notifications/read-all marks all read', async () => {
    const getRes = await apiRequest('/api/notifications');
    assert.strictEqual(getRes.status, 200);
    assert.ok(Array.isArray(getRes.data.data));

    const patchRes = await apiRequest('/api/notifications/read-all', { method: 'PATCH' });
    assert.strictEqual(patchRes.status, 200);
    assert.strictEqual(patchRes.data.ok, true);
    for (const notif of patchRes.data.data) {
      assert.strictEqual(notif.read, true);
    }
  });

  test('TC-MSG-01 [Positive]: GET /api/messages & POST /api/messages/:id/send updates lastMsg', async () => {
    const getRes = await apiRequest('/api/messages');
    assert.strictEqual(getRes.status, 200);
    assert.ok(Array.isArray(getRes.data.data));
    assert.ok(getRes.data.data.length > 0);

    const targetConv = getRes.data.data[0];
    const sendRes = await apiRequest(`/api/messages/${targetConv.id}/send`, {
      method: 'POST',
      body: { text: 'Hello batchmate, let us connect soon!' },
    });
    assert.strictEqual(sendRes.status, 200);
    assert.strictEqual(sendRes.data.ok, true);
    assert.strictEqual(sendRes.data.data.lastMsg, 'Hello batchmate, let us connect soon!');
  });
});
