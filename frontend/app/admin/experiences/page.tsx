'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { Experience } from '@/types';
import { formatDateRange } from '@/lib/date';
import { api } from '@/lib/api';

export default function AdminExperiencesPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchExperiences = async () => {
        try {
            const data = await api.experiences.getAll();
            setExperiences(data);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        setDeleting(id);
        try {
            await api.experiences.delete(id);
            setExperiences(experiences.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error deleting experience:', error);
            const message = error instanceof Error ? error.message : 'Failed to delete experience';
            alert(message);
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Experiences</h1>
                    <p className="text-gray-400">Manage your experiences</p>
                </div>
                <Link
                    href="/admin/experiences/create"
                    className="flex items-center gap-2 bg-brand-blue text-black font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors"
                >
                    <Plus size={20} />
                    <span>Add Experience</span>
                </Link>
            </div>

            {/* Experiences Table */}
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={32} className="text-brand-blue animate-spin" />
                    </div>
                ) : experiences.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">No experiences yet</p>
                        <Link
                            href="/admin/experiences/create"
                            className="inline-flex items-center gap-2 text-brand-blue hover:underline"
                        >
                            <Plus size={16} />
                            <span>Create your first experience</span>
                        </Link>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#2a2a2a]">
                                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4">
                                    Position
                                </th>
                                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden md:table-cell">
                                    Company
                                </th>
                                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden lg:table-cell">
                                    Start Date - End Date
                                </th>
                                <th className="text-left text-gray-400 text-sm font-medium px-6 py-4 hidden md:table-cell">
                                    Description
                                </th>
                                <th className="text-right text-gray-400 text-sm font-medium px-6 py-4">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {experiences.map((experience) => (
                                <tr
                                    key={experience.id}
                                    className="border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#0f0f0f] transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        {experience.position}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                                        {experience.company}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                                        {formatDateRange(experience.start_date, experience.end_date)}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                                        {experience.description}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/experiences/${experience.id}/edit`}
                                                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(experience.id)}
                                                disabled={deleting === experience.id}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] rounded-lg transition-colors disabled:opacity-50"
                                                title="Delete"
                                            >
                                                {deleting === experience.id ? (
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
