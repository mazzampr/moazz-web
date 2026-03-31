'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Plus, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Controller } from 'react-hook-form';
import Cookies from 'js-cookie';
import { compressImage } from '@/lib/utils/imageCompression';

const QuillEditor = dynamic(() => import('@/components/QuillEditor'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg animate-pulse" />
  ),
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Validation schema
const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  thumbnail_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  demo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  repo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_featured: z.boolean().optional(),
  project_date: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function CreateProjectPage() {
  const router = useRouter();
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      slug: '',
      thumbnail_url: '',
      demo_url: '',
      repo_url: '',
      is_featured: false,
      project_date: '',
    },
  });

  // Auto-generate slug from title
  const title = watch('title');
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setValue('slug', slug);
  };

  // Add tech to stack
  const addTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  // Remove tech from stack
  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  // Handle key press for tech input
  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTech();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');

      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append('file', compressedFile);

      const secret = Cookies.get('ADMIN_SECRET');

      const res = await fetch(`${API_URL}/upload/image`, {
        method: 'POST',
        headers: {
          ...(secret ? { 'x-api-key': secret } : {}),
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setValue(field, data.url, { shouldValidate: true });
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    const imageUrl = watch('thumbnail_url');
    if (!imageUrl) return;

    try {
      setIsDeletingImage(true);
      setError('');

      if (imageUrl.includes('supabase.co/storage')) {
        const secret = Cookies.get('ADMIN_SECRET');
        const res = await fetch(`${API_URL}/upload/image/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(secret ? { 'x-api-key': secret } : {}),
          },
          body: JSON.stringify({ url: imageUrl }),
        });

        if (!res.ok) {
          throw new Error('Delete failed');
        }
      }

      setValue('thumbnail_url', '', { shouldValidate: true });
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
    } finally {
      setIsDeletingImage(false);
    }
  };

  // Form submission
  const onSubmit = async (data: ProjectFormData) => {
    if (techStack.length === 0) {
      setError('Please add at least one technology to the tech stack');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        ...data,
        thumbnail_url: data.thumbnail_url || undefined,
        demo_url: data.demo_url || undefined,
        repo_url: data.repo_url || undefined,
        tech_stack: techStack,
        is_featured: data.is_featured,
        project_date: data.project_date || undefined,
      };

      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to create project');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Error connecting to server');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Create Project</h1>
        <p className="text-gray-400">Add a new project to your portfolio</p>
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
            placeholder="My Awesome Project"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
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
              /projects/
            </span>
            <input
              {...register('slug')}
              placeholder="my-awesome-project"
              className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-r-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
            />
          </div>
          {errors.slug && (
            <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>
          )}
        </div>

        {/* Removed old description here */}

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tech Stack <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={handleTechKeyPress}
              placeholder="e.g., React, TypeScript, Node.js"
              className="flex-1 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
            />
            <button
              type="button"
              onClick={addTech}
              className="px-4 py-3 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    className="hover:text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Thumbnail Image
          </label>
          <div className="space-y-4">
            {watch('thumbnail_url') && (
              <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-[#2a2a2a]">
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  disabled={isDeletingImage}
                  className="absolute right-2 top-2 z-10 inline-flex items-center justify-center rounded-md bg-red-500/90 p-2 text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Delete thumbnail"
                >
                  {isDeletingImage ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
                <img
                  src={watch('thumbnail_url')}
                  alt="Thumbnail preview"
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white px-4 py-2 rounded-lg border border-[#3a3a3a] transition-colors inline-block">
                {isUploading ? 'Uploading...' : 'Upload Image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'thumbnail_url')}
                  disabled={isUploading}
                />
              </label>
              {(isUploading) && <Loader2 className="w-5 h-5 animate-spin text-brand-blue" />}
            </div>
            {errors.thumbnail_url && (
              <p className="mt-1 text-sm text-red-400">{errors.thumbnail_url.message}</p>
            )}
          </div>
        </div>

        {/* Demo URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Demo URL
          </label>
          <input
            {...register('demo_url')}
            placeholder="https://myproject.vercel.app"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
          />
          {errors.demo_url && (
            <p className="mt-1 text-sm text-red-400">{errors.demo_url.message}</p>
          )}
        </div>

        {/* Repo URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Repository URL
          </label>
          <input
            {...register('repo_url')}
            placeholder="https://github.com/username/repo"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
          />
          {errors.repo_url && (
            <p className="mt-1 text-sm text-red-400">{errors.repo_url.message}</p>
          )}
        </div>

        {/* Project Date */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Date
          </label>
          <input
            type="date"
            {...register('project_date')}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors [color-scheme:dark]"
          />
          <p className="mt-1 text-xs text-gray-500">
            The date when this project was created or completed. Only the year will be shown publicly.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <div className="prose-editor min-h-[400px]">
                <QuillEditor value={field.value} onChange={field.onChange} />
              </div>
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3 bg-[#1a1a1a] p-4 rounded-lg border border-[#2a2a2a]">
          <input
            type="checkbox"
            id="is_featured"
            {...register('is_featured')}
            className="w-5 h-5 rounded border-[#2a2a2a] text-brand-blue focus:ring-brand-blue bg-[#0a0a0a]"
          />
          <div className="flex-1">
            <label htmlFor="is_featured" className="block text-sm font-medium text-white cursor-pointer select-none">
              Feature this project
            </label>
            <p className="text-xs text-gray-400">Featured projects will appear on the homepage (max 6 recommended).</p>
          </div>
        </div>

        {/* Submit Button */}
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
              <span>Create Project</span>
            )}
          </button>
          <Link
            href="/admin/projects"
            className="px-6 py-3 border border-[#2a2a2a] text-gray-400 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
