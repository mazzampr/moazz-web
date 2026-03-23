'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, FileText, Plus, ArrowRight, BarChart3, Briefcase, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ projects: 0, articles: 0, experiences: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [projectsRes, articlesRes, experiencesRes] = await Promise.all([
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/articles?all=true`),
          fetch(`${API_URL}/experiences`),
        ]);
        const [projects, articles, experiences] = await Promise.all([
          projectsRes.ok ? projectsRes.json() : [],
          articlesRes.ok ? articlesRes.json() : [],
          experiencesRes.ok ? experiencesRes.json() : [],
        ]);
        setCounts({
          projects: projects.length,
          articles: articles.length,
          experiences: experiences.length,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome to your admin panel. Manage your portfolio content from here.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-brand-blue/10 rounded-lg flex items-center justify-center">
              <FolderKanban size={24} className="text-brand-blue" />
            </div>
            <span className="text-3xl font-bold text-white">
              {loading ? <Loader2 size={24} className="animate-spin text-gray-500" /> : counts.projects}
            </span>
          </div>
          <h3 className="text-gray-400 text-sm">Total Projects</h3>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-blue-500" />
            </div>
            <span className="text-3xl font-bold text-white">
              {loading ? <Loader2 size={24} className="animate-spin text-gray-500" /> : counts.articles}
            </span>
          </div>
          <h3 className="text-gray-400 text-sm">Total Articles</h3>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Briefcase size={24} className="text-purple-500" />
            </div>
            <span className="text-3xl font-bold text-white">
              {loading ? <Loader2 size={24} className="animate-spin text-gray-500" /> : counts.experiences}
            </span>
          </div>
          <h3 className="text-gray-400 text-sm">Experiences</h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Create Project */}
          <Link
            href="/admin/projects/create"
            className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-brand-blue transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-black" />
              </div>
              <ArrowRight
                size={20}
                className="text-gray-500 group-hover:text-brand-blue group-hover:translate-x-1 transition-all"
              />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Create New Project
            </h3>
            <p className="text-gray-400 text-sm">
              Add a new project to your portfolio showcase
            </p>
          </Link>

          {/* Create Article */}
          <Link
            href="/admin/articles/create"
            className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-brand-blue transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-black" />
              </div>
              <ArrowRight
                size={20}
                className="text-gray-500 group-hover:text-brand-blue group-hover:translate-x-1 transition-all"
              />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Write New Article
            </h3>
            <p className="text-gray-400 text-sm">
              Create a new blog post with the markdown editor
            </p>
          </Link>

          {/* Create Experience */}
          <Link
            href="/admin/experiences/create"
            className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-brand-blue transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-brand-blue rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} className="text-black" />
              </div>
              <ArrowRight
                size={20}
                className="text-gray-500 group-hover:text-brand-blue group-hover:translate-x-1 transition-all"
              />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Add Experience
            </h3>
            <p className="text-gray-400 text-sm">
              Add a new work experience to your timeline
            </p>
          </Link>
        </div>
      </div>

      {/* Management Sections */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Manage Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Projects Management */}
          <Link
            href="/admin/projects"
            className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#2a2a2a] transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                <FolderKanban size={20} className="text-brand-blue" />
              </div>
              <div>
                <h3 className="font-bold text-white">Projects</h3>
                <p className="text-xs text-gray-500">View & Edit</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Manage your portfolio projects, update details, or remove entries.
            </p>
          </Link>

          {/* Articles Management */}
          <Link
            href="/admin/articles"
            className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#2a2a2a] transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <FileText size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Articles</h3>
                <p className="text-xs text-gray-500">View & Edit</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Manage your blog posts, publish drafts, or edit existing content.
            </p>
          </Link>

          {/* Experiences Management */}
          <Link
            href="/admin/experiences"
            className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#2a2a2a] transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Briefcase size={20} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-bold text-white">Experiences</h3>
                <p className="text-xs text-gray-500">View & Edit</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Manage your work experiences and timeline entries.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
