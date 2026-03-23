// API client configuration
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeaders = () => {
  const secret = Cookies.get('ADMIN_SECRET');
  return {
    'Content-Type': 'application/json',
    ...(secret ? { 'x-api-key': secret } : {}),
  };
};

export const api = {
  // Projects
  projects: {
    getAll: () => fetch(`${API_BASE_URL}/projects`).then(res => res.json()),
    getBySlug: (slug: string) => fetch(`${API_BASE_URL}/projects/${slug}`).then(res => res.json()),
    create: (data: any) => fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(res => res.json()),
  },

  // Experiences
  experiences: {
    getAll: () => fetch(`${API_BASE_URL}/experiences`).then(res => res.json()),
    getById: (id: string) => fetch(`${API_BASE_URL}/experiences/${id}`).then(res => res.json()),
    create: (data: any) => fetch(`${API_BASE_URL}/experiences`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(res => res.json()),
  },

  // Articles
  articles: {
    getAll: () => fetch(`${API_BASE_URL}/articles`).then(res => res.json()),
    getBySlug: (slug: string) => fetch(`${API_BASE_URL}/articles/${slug}`).then(res => res.json()),
    create: (data: any) => fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }).then(res => res.json()),
  },
};
