'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Tags } from 'lucide-react';
import { Article } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_URL}/articles?all=true`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`${API_URL}/articles/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== id));
      } else {
        alert('Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    } finally {
      setDeleting(null);
    }
  };

  const togglePublish = async (article: Article) => {
    try {
      const res = await fetch(`${API_URL}/articles/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_published: !article.is_published,
          published_at: !article.is_published ? new Date().toISOString() : null,
        }),
      });
      if (res.ok) {
        setArticles(
          articles.map((a) =>
            a.id === article.id
              ? {
                ...a,
                is_published: !a.is_published,
                published_at: !a.is_published ? new Date().toISOString() : undefined,
              }
              : a
          )
        );
      }
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Articles</h1>
          <p className="text-gray-400">Manage your blog posts</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/articles/categories"
            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#2a2a2a] transition-colors"
          >
            <Tags size={20} />
            <span className="hidden sm:inline">Categories</span>
          </Link>
          <Link
            href="/admin/articles/create"
            className="flex items-center gap-2 bg-brand-blue text-black font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Write Article</span>
          </Link>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="text-brand-blue animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No articles yet</p>
            <Link
              href="/admin/articles/create"
              className="inline-flex items-center gap-2 text-brand-blue hover:underline"
            >
              <Plus size={16} />
              <span>Write your first article</span>
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2a2a]">
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">
                  Title
                </th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden md:table-cell">
                  Slug
                </th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden lg:table-cell">
                  Status
                </th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden md:table-cell">
                  Categories
                </th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden md:table-cell">
                  Date
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#0f0f0f] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{article.title}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                    /{article.slug}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${article.is_published
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                        }`}
                    >
                      {article.is_published ? (
                        <>
                          <Eye size={12} />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} />
                          Draft
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                    {article.categories?.map(c => c.name).join(', ') || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => togglePublish(article)}
                        className={`p-2 rounded-lg transition-colors ${article.is_published
                          ? 'text-green-400 hover:bg-green-500/10'
                          : 'text-yellow-400 hover:bg-yellow-500/10'
                          }`}
                        title={article.is_published ? 'Unpublish' : 'Publish'}
                      >
                        {article.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deleting === article.id}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === article.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
