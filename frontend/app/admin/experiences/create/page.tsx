'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const experienceSchema = z.object({
  position: z.string().min(1, 'Position is required'),
  company: z.string().min(1, 'Company is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  order: z.string().optional(),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

export default function CreateExperiencePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      position: '',
      company: '',
      start_date: '',
      end_date: '',
      description: '',
      order: '0',
    },
  });

  const onSubmit = async (data: ExperienceFormData) => {
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        position: data.position,
        company: data.company,
        start_date: data.start_date,
        end_date: data.end_date || undefined,
        description: data.description,
        order: data.order ? parseInt(data.order, 10) : 0,
      };

      const res = await fetch(`${API_URL}/experiences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/experiences');
        router.refresh();
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Failed to create experience');
      }
    } catch (err) {
      console.error('Error creating experience:', err);
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
          href="/admin/experiences"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Experiences</span>
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Add Experience</h1>
        <p className="text-gray-400">Add a new work experience to your timeline</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Position <span className="text-red-400">*</span>
          </label>
          <input
            {...register('position')}
            placeholder="e.g. Full Stack Developer"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-400">{errors.position.message}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company <span className="text-red-400">*</span>
          </label>
          <input
            {...register('company')}
            placeholder="e.g. Google"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-400">{errors.company.message}</p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Start Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              {...register('start_date')}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors [color-scheme:dark]"
            />
            {errors.start_date && (
              <p className="mt-1 text-sm text-red-400">{errors.start_date.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              End Date <span className="text-gray-500">(leave empty for Present)</span>
            </label>
            <input
              type="date"
              {...register('end_date')}
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            {...register('description')}
            placeholder="Describe your role, responsibilities, and achievements..."
            rows={4}
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors resize-none"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
          )}
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Display Order
          </label>
          <input
            type="number"
            {...register('order')}
            placeholder="0"
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-colors"
          />
          <p className="mt-1 text-xs text-gray-500">
            Lower numbers appear first in the timeline
          </p>
        </div>

        {/* Submit */}
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
              <span>Add Experience</span>
            )}
          </button>
          <Link
            href="/admin/experiences"
            className="px-6 py-3 border border-[#2a2a2a] text-gray-400 rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
