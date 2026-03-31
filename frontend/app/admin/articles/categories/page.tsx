'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Loader2, Edit2, Check, X } from 'lucide-react';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatName, setNewCatName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setSubmitting(true);
    setError('');

    const secret = Cookies.get('ADMIN_SECRET');
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'x-api-key': secret } : {}),
        },
        body: JSON.stringify({ name: newCatName, slug }),
      });

      if (!res.ok) {
        throw new Error('Failed to create category (slug might already exist)');
      }

      setNewCatName('');
      await fetchCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    const secret = Cookies.get('ADMIN_SECRET');
    try {
      await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          ...(secret ? { 'x-api-key': secret } : {}),
        },
      });
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditCatName(name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditCatName('');
  };

  const handleUpdate = async (id: string) => {
    if (!editCatName.trim()) return;
    try {
      const secret = Cookies.get('ADMIN_SECRET');
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'x-api-key': secret } : {}),
        },
        body: JSON.stringify({
          name: editCatName,
          slug: editCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        }),
      });

      if (res.ok) {
        cancelEditing();
        fetchCategories();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to update category');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while updating');
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            href="/admin/articles"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Articles</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Categories</h1>
          <p className="text-gray-400">Add or remove article categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <form onSubmit={handleCreate} className="bg-[#1a1a1a] p-6 rounded-xl border border-[#2a2a2a] sticky top-6">
            <h2 className="text-xl font-bold text-white mb-4">New Category</h2>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category Name</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-2 text-white outline-none focus:border-brand-blue"
                  placeholder="e.g. Machine Learning"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-brand-blue text-black font-semibold rounded-lg hover:bg-white transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Add Category
              </button>
            </div>
          </form>
        </div>

        <div className="md:col-span-2 space-y-4">
          {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="animate-spin text-brand-blue" /></div>
          ) : categories.length === 0 ? (
            <div className="p-10 text-center text-gray-400 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
              No categories exist yet.
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat.id} className="flex flex-wrap items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] gap-4">
                {editingId === cat.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <input
                      type="text"
                      value={editCatName}
                      onChange={(e) => setEditCatName(e.target.value)}
                      className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-1 text-white outline-none focus:border-brand-blue"
                      placeholder="Category name"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="p-2 text-green-400 rounded-lg hover:bg-green-400/10 transition-colors"
                      title="Save"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="p-2 text-gray-400 rounded-lg hover:bg-gray-400/10 transition-colors"
                      title="Cancel"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                      <code className="text-sm text-brand-blue">{cat.slug}</code>
                      <div className="text-xs text-gray-500 mt-1">{cat._count?.articles} articles</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEditing(cat.id, cat.name)}
                        className="p-2 text-blue-400 rounded-lg hover:bg-blue-400/10 transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-2 text-red-400 rounded-lg hover:bg-red-400/10 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}