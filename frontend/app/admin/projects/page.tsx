'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, Star } from 'lucide-react';
import { Project } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    setDeleting(id);
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage your portfolio projects</p>
        </div>
        <Link
          href="/admin/projects/create"
          className="flex items-center gap-2 bg-brand-blue text-black font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors"
        >
          <Plus size={20} />
          <span>Add Project</span>
        </Link>
      </div>

      {/* Projects Table */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="text-brand-blue animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No projects yet</p>
            <Link
              href="/admin/projects/create"
              className="inline-flex items-center gap-2 text-brand-blue hover:underline"
            >
              <Plus size={16} />
              <span>Create your first project</span>
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
                  Tech Stack
                </th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden md:table-cell">
                  Created
                </th>
                <th className="text-center text-gray-400 text-sm font-medium px-6 py-4">
                  Featured
                </th>
                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#0f0f0f] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {project.thumbnail_url ? (
                        <img
                          src={project.thumbnail_url}
                          alt={project.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#2a2a2a] rounded flex items-center justify-center text-gray-500 text-sm font-bold">
                          {project.title.charAt(0)}
                        </div>
                      )}
                      <span className="text-white font-medium">
                        {project.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                    /{project.slug}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {project.tech_stack?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-[#2a2a2a] text-gray-300 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack?.length > 3 && (
                        <span className="px-2 py-0.5 bg-[#2a2a2a] text-gray-500 text-xs rounded">
                          +{project.tech_stack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                    {new Date(project.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {project.is_featured ? (
                      <Star size={16} className="text-yellow-400 fill-yellow-400 mx-auto" />
                    ) : (
                      <Star size={16} className="text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-brand-blue hover:bg-[#2a2a2a] rounded-lg transition-colors"
                          title="View Demo"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deleting === project.id}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === project.id ? (
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
