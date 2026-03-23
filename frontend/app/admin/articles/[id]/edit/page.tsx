'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg animate-pulse" />
  ),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  is_published: z.boolean(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
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

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`${API_URL}/articles/id/${id}`);
        if (res.ok) {
          const data = await res.json();
          reset({
            title: data.title,
            slug: data.slug,
            content: data.content,
            is_published: data.is_published,
          });
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id, reset]);

  const editorOptions = useMemo(
    () => ({
      spellChecker: false,
      placeholder: 'Write your article content here...',
      status: false,
      autofocus: false,
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        'image',
        'code',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        '|',
        'guide',
      ] as const,
    }),
    []
  );

  const onSubmit = async (data: ArticleFormData) => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...data,
        published_at: data.is_published ? new Date().toISOString() : undefined,
      };

      const res = await fetch(`${API_URL}/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/articles');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to update article');
      }
    } catch (err) {
      console.error('Error updating article:', err);
      setError('Error connecting to server');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Article</h1>
        <p className="text-gray-400">Update your blog post</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            {...register('title')}
            placeholder="My Awesome Article"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors text-lg"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
          )}
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content <span className="text-red-400">*</span>
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <div className="prose-editor">
                <SimpleMDE
                  value={field.value}
                  onChange={field.onChange}
                  options={editorOptions}
                />
              </div>
            )}
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-400">{errors.content.message}</p>
          )}
        </div>

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
                  ? 'This article is visible on your site'
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

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-brand-blue text-black font-bold py-3 px-6 rounded-lg hover:bg-white hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
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
        .prose-editor .EasyMDEContainer {
          background: #0a0a0a;
        }
        .prose-editor .EasyMDEContainer .CodeMirror {
          background: #0a0a0a;
          color: #f4f4f4;
          border: 1px solid #2a2a2a;
          border-radius: 0.5rem;
        }
        .prose-editor .EasyMDEContainer .CodeMirror-cursor {
          border-left-color: #ccff00;
        }
        .prose-editor .editor-toolbar {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-bottom: none;
          border-radius: 0.5rem 0.5rem 0 0;
        }
        .prose-editor .editor-toolbar button {
          color: #888 !important;
        }
        .prose-editor .editor-toolbar button:hover,
        .prose-editor .editor-toolbar button.active {
          background: #2a2a2a;
          color: #ccff00 !important;
        }
        .prose-editor .CodeMirror-selected {
          background: rgba(204, 255, 0, 0.2) !important;
        }
        .prose-editor .CodeMirror-focused .CodeMirror-selected {
          background: rgba(204, 255, 0, 0.3) !important;
        }
        .prose-editor .cm-header {
          color: #ccff00 !important;
        }
        .prose-editor .cm-link {
          color: #3b82f6 !important;
        }
        .prose-editor .cm-url {
          color: #888 !important;
        }
        .prose-editor .cm-quote {
          color: #888 !important;
          font-style: italic;
        }
        .prose-editor .editor-preview,
        .prose-editor .editor-preview-side {
          background: #0a0a0a;
          color: #f4f4f4;
        }
        .prose-editor .editor-preview h1,
        .prose-editor .editor-preview h2,
        .prose-editor .editor-preview h3,
        .prose-editor .editor-preview-side h1,
        .prose-editor .editor-preview-side h2,
        .prose-editor .editor-preview-side h3 {
          color: #ccff00;
        }
        .prose-editor .editor-preview pre,
        .prose-editor .editor-preview-side pre {
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
        }
        .prose-editor .editor-preview code,
        .prose-editor .editor-preview-side code {
          background: #1a1a1a;
          color: #ccff00;
        }
      `}</style>
    </div>
  );
}
