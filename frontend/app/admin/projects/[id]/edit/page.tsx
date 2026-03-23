'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

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

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`${API_URL}/projects/id/${id}`);
        if (res.ok) {
          const data = await res.json();
          reset({
            title: data.title,
            description: data.description,
            slug: data.slug,
            thumbnail_url: data.thumbnail_url || '',
            demo_url: data.demo_url || '',
            repo_url: data.repo_url || '',
            is_featured: data.is_featured || false,
            project_date: data.project_date ? new Date(data.project_date).toISOString().split('T')[0] : '',
          });
          setTechStack(data.tech_stack || []);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id, reset]);

  const addTech = () => {
    if (techInput.trim() && !techStack.includes(techInput.trim())) {
      setTechStack([...techStack, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  const handleTechKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTech();
    }
  };

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

      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to update project');
      }
    } catch (err) {
      console.error('Error updating project:', err);
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
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Edit Project</h1>
        <p className="text-gray-400">Update your project details</p>
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
            placeholder="My Awesome Project"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            {...register('description')}
            placeholder="A brief description of your project..."
            rows={4}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors resize-none"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tech Stack <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={handleTechKeyPress}
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

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Thumbnail URL
          </label>
          <input
            {...register('thumbnail_url')}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
          />
          {errors.thumbnail_url && (
            <p className="mt-1 text-sm text-red-400">{errors.thumbnail_url.message}</p>
          )}
        </div>

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
