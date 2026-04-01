'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Cookies from 'js-cookie';

const QuillEditor = dynamic(() => import('@/components/QuillEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg animate-pulse" />
  ),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Validation schema
const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  is_published: z.boolean(),
  categoryIds: z.array(z.string()).optional(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function CreateArticlePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then(res => res.json())
      .then(data => setCategories(data || []))
      .catch(err => console.error(err));
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    setCreatingCat(true);
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    const secret = Cookies.get('ADMIN_SECRET');

    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'x-api-key': secret } : {}),
        },
        body: JSON.stringify({ name: newCatName, slug }),
      });
      if (res.ok) {
        const newCat = await res.json();
        setCategories([newCat, ...categories]);
        setNewCatName('');
      } else {
        alert('Failed to create category');
      }
    } catch(err) {
      alert('Error creating category');
    } finally {
      setCreatingCat(false);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      slug: '',
      content: '',
      is_published: false,
    },
  });

  const isPublished = watch('is_published');

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setValue('slug', slug);
  };

  // Form submission
  const onSubmit = async (data: ArticleFormData) => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...data,
        published_at: data.is_published ? new Date().toISOString() : undefined,
      };

      const secret = Cookies.get('ADMIN_SECRET');
      
      const res = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'x-api-key': secret } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to create article');
      }
    } catch (err) {
      console.error('Error creating article:', err);
      setError('Error connecting to server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Write Article</h1>
        <p className="text-gray-400">Create a new blog post</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            {...register('title')}
            onChange={(e) => {
              register('title').onChange(e);
              handleTitleChange(e);
            }}
            placeholder="My Awesome Article"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors text-lg"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Slug <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center">
            <span className="bg-[#1a1a1a] border border-r-0 border-[#2a2a2a] rounded-l-lg px-4 py-3 text-gray-500">
              /articles/
            </span>
            <input
              {...register('slug')}
              placeholder="my-awesome-article"
              className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-r-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
            />
          </div>
          {errors.slug && (
            <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>
          )}
        </div>

        {/* Categories */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-300 mb-4">Categories</label>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <label key={cat.id} className="inline-flex items-center gap-2 bg-[#0a0a0a] border border-[#2a2a2a] px-3 py-1.5 rounded-full cursor-pointer hover:border-brand-blue transition-colors">
                <input 
                  type="checkbox" 
                  value={cat.id} 
                  {...register('categoryIds')}
                  className="accent-brand-blue bg-[#0a0a0a] border-[#2a2a2a]"
                />
                <span className="text-sm text-gray-300">{cat.name}</span>
              </label>
            ))}
            {categories.length === 0 && <span className="text-sm text-gray-500">No categories found.</span>}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleCreateCategory(e); } }}
              placeholder="New category..."
              className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue text-sm w-48"
            />
            <button 
              type="button" 
              onClick={handleCreateCategory}
              disabled={creatingCat || !newCatName.trim()}
              className="bg-brand-blue text-black text-sm px-3 py-1.5 rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50"
            >
              {creatingCat ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

        {/* Content - Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content <span className="text-red-400">*</span>
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div className="prose-editor">
                <QuillEditor
                  value={field.value}
                  onChange={field.onChange}
                />
              </div>
            )}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
          )}
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
          <div className="flex items-center gap-3">
            {isPublished ? (
              <Eye size={20} className="text-green-400" />
            ) : (
              <EyeOff size={20} className="text-yellow-400" />
            )}
            <div>
              <h4 className="text-white font-medium">
                {isPublished ? 'Published' : 'Draft'}
              </h4>
              <p className="text-gray-400 text-sm">
                {isPublished
                  ? 'This article will be visible on your site'
                  : 'This article is saved but not visible'}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...register('is_published')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#2a2a2a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-brand-blue text-black font-bold py-3 px-6 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <span>{isPublished ? 'Publish Article' : 'Save Draft'}</span>
            )}
          </button>
          <Link
            href="/admin/articles"
            className="px-6 py-3 border border-[#2a2a2a] text-gray-400 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>

      <style jsx global>{`
        .prose-editor .ql-toolbar.ql-snow {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .prose-editor .ql-container.ql-snow {
          border: 1px solid #2a2a2a;
          border-radius: 0 0 0.5rem 0.5rem;
          background: #0a0a0a;
          color: #f4f4f4;
        }
        .prose-editor .ql-editor {
          min-height: 16rem;
        }
        .prose-editor .ql-editor.ql-blank::before {
          color: #6b7280;
        }
        .prose-editor .ql-toolbar .ql-stroke {
          stroke: #a3a3a3;
        }
        .prose-editor .ql-toolbar .ql-fill {
          fill: #a3a3a3;
        }
        .prose-editor .ql-toolbar .ql-picker {
          color: #a3a3a3;
        }
        .prose-editor .ql-toolbar .ql-picker-options {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
        }
        .prose-editor .ql-toolbar button:hover,
        .prose-editor .ql-toolbar button.ql-active,
        .prose-editor .ql-toolbar .ql-picker-label:hover,
        .prose-editor .ql-toolbar .ql-picker-label.ql-active {
          color: #3b82f6;
        }
        .prose-editor .ql-toolbar button:hover .ql-stroke,
        .prose-editor .ql-toolbar button.ql-active .ql-stroke {
          stroke: #3b82f6;
        }
        .prose-editor .ql-toolbar button:hover .ql-fill,
        .prose-editor .ql-toolbar button.ql-active .ql-fill {
          fill: #3b82f6;
        }
        .prose-editor .ql-editor h1,
        .prose-editor .ql-editor h2,
        .prose-editor .ql-editor h3 {
          color: #3b82f6;
        }
        .prose-editor .ql-editor a {
          color: #3b82f6;
        }
        .prose-editor .ql-editor blockquote {
          border-left: 4px solid #2a2a2a;
          color: #a3a3a3;
        }
        .prose-editor .ql-editor pre {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
        }
      `}</style>
    </div>
  );
}
