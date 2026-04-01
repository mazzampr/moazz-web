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


const getAuthHeadersWithoutContentType = (): Record<string, string> => {
  const secret = Cookies.get('ADMIN_SECRET');
  return secret ? { 'x-api-key': secret } : {};
};

export const api = {
  // Projects
  projects: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/projects`);
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
    
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/projects/id/${id}`);
      if (!res.ok) throw new Error('Failed to fetch project');
      return res.json();
    },
    
    getBySlug: async (slug: string) => {
      const res = await fetch(`${API_BASE_URL}/projects/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch project');
      return res.json();
    },
    
    create: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create project');
      }
      return res.json();
    },
    
    update: async (id: string, data: any) => {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update project');
      }
      return res.json();
    },
    
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeadersWithoutContentType(),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete project');
      }
      return res.ok;
    },
  },

  // Experiences
  experiences: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/experiences`);
      if (!res.ok) throw new Error('Failed to fetch experiences');
      return res.json();
    },
    
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/experiences/${id}`);
      if (!res.ok) throw new Error('Failed to fetch experience');
      return res.json();
    },
    
    create: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/experiences`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create experience');
      }
      return res.json();
    },
    
    update: async (id: string, data: any) => {
      const res = await fetch(`${API_BASE_URL}/experiences/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update experience');
      }
      return res.json();
    },
    
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/experiences/${id}`, {
        method: 'DELETE',
        headers: getAuthHeadersWithoutContentType(),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete experience');
      }
      return res.ok;
    },
  },

  // Articles
  articles: {
    getAll: async (includeUnpublished = false) => {
      const url = includeUnpublished 
        ? `${API_BASE_URL}/articles?all=true` 
        : `${API_BASE_URL}/articles`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch articles');
      return res.json();
    },
    
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/articles/id/${id}`);
      if (!res.ok) throw new Error('Failed to fetch article');
      return res.json();
    },
    
    getBySlug: async (slug: string) => {
      const res = await fetch(`${API_BASE_URL}/articles/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch article');
      return res.json();
    },
    
    create: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/articles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create article');
      }
      return res.json();
    },
    
    update: async (id: string, data: any) => {
      const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update article');
      }
      return res.json();
    },
    
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeadersWithoutContentType(),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete article');
      }
      return res.ok;
    },
    
    togglePublish: async (id: string, isPublished: boolean) => {
      const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          is_published: !isPublished,
          published_at: !isPublished ? new Date().toISOString() : null,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to toggle publish status');
      }
      return res.json();
    },
  },

  // Categories
  categories: {
    getAll: async () => {
      const res = await fetch(`${API_BASE_URL}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    },
    
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`);
      if (!res.ok) throw new Error('Failed to fetch category');
      return res.json();
    },
    
    create: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create category');
      }
      return res.json();
    },
    
    update: async (id: string, data: any) => {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update category');
      }
      return res.json();
    },
    
    delete: async (id: string) => {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeadersWithoutContentType(),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete category');
      }
      return res.ok;
    },
  },

  // Authentication
  auth: {
    verify: async (apiKey: string) => {
      const res = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
      });
      if (!res.ok) throw new Error('Invalid API key');
      return res.json();
    },
  },

  // Image upload
  upload: {
    image: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const secret = Cookies.get('ADMIN_SECRET');
      const res = await fetch(`${API_BASE_URL}/upload/image`, {
        method: 'POST',
        headers: secret ? { 'x-api-key': secret } : {},
        body: formData,
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to upload image');
      }
      return res.json();
    },
    
    deleteImage: async (url: string) => {
      const secret = Cookies.get('ADMIN_SECRET');
      const res = await fetch(`${API_BASE_URL}/upload/image/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'x-api-key': secret } : {}),
        },
        body: JSON.stringify({ url }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete image');
      }
      return res.ok;
    },
  },
};
