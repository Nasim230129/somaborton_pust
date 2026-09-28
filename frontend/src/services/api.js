import { useState, useEffect } from 'react';
import {
  pa,
  ma,
  ha,
  Sa,
  ga,
  _a,
  va,
  ya,
  ba,
  xa,
  Ca,
  O,
} from '../data/mockData';

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  try {
    const token = localStorage.getItem('pust_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    // Graceful offline fallback so UI never breaks
    console.debug('API fallback active:', err.message);
    return { ok: false, offline: true };
  }
}

export async function syncWithBackend() {
  const data = await request('/bootstrap');
  if (data && data.ok) {
    if (Array.isArray(data.alumni) && data.alumni.length) {
      pa.splice(0, pa.length, ...data.alumni);
    }
    if (Array.isArray(data.students) && data.students.length) {
      ma.splice(0, ma.length, ...data.students);
    }
    if (Array.isArray(data.faculty) && data.faculty.length) {
      ha.splice(0, ha.length, ...data.faculty);
    }
    if (Array.isArray(data.employers) && data.employers.length) {
      Sa.splice(0, Sa.length, ...data.employers);
    }
    if (Array.isArray(data.departments) && data.departments.length) {
      ga.splice(0, ga.length, ...data.departments);
    }
    if (Array.isArray(data.events) && data.events.length) {
      _a.splice(0, _a.length, ...data.events);
    }
    if (Array.isArray(data.jobs) && data.jobs.length) {
      va.splice(0, va.length, ...data.jobs);
    }
    if (Array.isArray(data.stories) && data.stories.length) {
      ya.splice(0, ya.length, ...data.stories);
    }
    if (Array.isArray(data.notifications) && data.notifications.length) {
      ba.splice(0, ba.length, ...data.notifications);
    }
    if (Array.isArray(data.messages) && data.messages.length) {
      xa.splice(0, xa.length, ...data.messages);
    }
    if (Array.isArray(data.gallery) && data.gallery.length) {
      Ca.splice(0, Ca.length, ...data.gallery);
    }
    if (Array.isArray(data.awards) && data.awards.length) {
      O.splice(0, O.length, ...data.awards);
    }
    window.dispatchEvent(new CustomEvent('pust-data-synced', { detail: data }));
  }
  return data;
}

export function useBackendSync() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener('pust-data-synced', handler);
    return () => window.removeEventListener('pust-data-synced', handler);
  }, []);
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('pust_user');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return pa[0];
}

export const api = {
  login: async (payload) => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res && res.ok && res.token) {
      localStorage.setItem('pust_token', res.token);
      localStorage.setItem('pust_user', JSON.stringify(res.user));
    }
    return res;
  },
  register: async (payload) => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res && res.ok && res.token) {
      localStorage.setItem('pust_token', res.token);
      localStorage.setItem('pust_user', JSON.stringify(res.user));
      await syncWithBackend();
    }
    return res;
  },
  logout: () => {
    localStorage.removeItem('pust_token');
    localStorage.removeItem('pust_user');
  },
  connectAlumni: (id) =>
    request(`/alumni/${id}/connect`, { method: 'POST' }),
  submitContact: (payload) =>
    request('/contact', { method: 'POST', body: JSON.stringify(payload) }),
  submitDonation: (payload) =>
    request('/donations', { method: 'POST', body: JSON.stringify(payload) }),
  registerEvent: (id, payload = {}) =>
    request(`/events/${id}/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  createEvent: async (payload) => {
    const res = await request('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await syncWithBackend();
    return res;
  },
  deleteEvent: async (id) => {
    const res = await request(`/events/${id}`, { method: 'DELETE' });
    await syncWithBackend();
    return res;
  },
  applyJob: (id, payload = {}) =>
    request(`/jobs/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  createJob: async (payload) => {
    const res = await request('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await syncWithBackend();
    return res;
  },
  updateJob: async (id, payload) => {
    const res = await request(`/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    await syncWithBackend();
    return res;
  },
  deleteJob: async (id) => {
    const res = await request(`/jobs/${id}`, { method: 'DELETE' });
    await syncWithBackend();
    return res;
  },
  createStory: async (payload) => {
    const res = await request('/stories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    await syncWithBackend();
    return res;
  },
  likeGallery: (id) =>
    request(`/gallery/${id}/like`, { method: 'POST' }),
  createCommunityPost: (payload) =>
    request('/community', { method: 'POST', body: JSON.stringify(payload) }),
  requestMentorship: (payload) =>
    request('/mentorship/request', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProfile: async (id, payload) => {
    const res = await request(`/alumni/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    if (res && res.ok && res.data) {
      localStorage.setItem('pust_user', JSON.stringify(res.data));
      await syncWithBackend();
    }
    return res;
  },
  markNotificationsRead: () =>
    request('/notifications/read-all', { method: 'PATCH' }),
  sendMessage: (id, text) =>
    request(`/messages/${id}/send`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),
  updateVerification: (id, status) =>
    request(`/admin/verifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  updateUser: async (id, payload) => {
    const res = await request(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    await syncWithBackend();
    return res;
  },
  deleteUser: async (id) => {
    const res = await request(`/admin/users/${id}`, { method: 'DELETE' });
    await syncWithBackend();
    return res;
  },
};
