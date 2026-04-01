'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Project } from '@/types';

interface ProjectsListProps {
  projects: Project[];
}

// Helper function to strip HTML tags for preview text
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Extract tech stacks that are used in more than 1 project
  const allTechStacks = useMemo(() => {
    const techCount = new Map<string, number>();
    projects.forEach((project) => {
      project.tech_stack?.forEach((tech) => {
        techCount.set(tech, (techCount.get(tech) || 0) + 1);
      });
    });
    // Only include tech stacks used in 2 or more projects
    return Array.from(techCount.entries())
      .filter(([, count]) => count >= 2)
      .map(([tech]) => tech)
      .sort((a, b) => a.localeCompare(b));
  }, [projects]);

  // Filter projects based on selected tech
  const filteredProjects = useMemo(() => {
    if (!selectedTech) return projects;
    return projects.filter((project) => 
      project.tech_stack?.includes(selectedTech)
    );
  }, [projects, selectedTech]);

  return (
    <>
      {/* Tech Stack Filter */}
      {allTechStacks.length > 0 && (
        <div className="mb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTech(null)}
              className={`px-4 py-2 text-sm font-mono rounded-full border transition-colors ${
                selectedTech === null
                  ? 'bg-brand-blue text-black border-brand-blue'
                  : 'bg-transparent text-gray-400 border-white/20 hover:border-brand-blue hover:text-white'
              }`}
            >
              All
            </button>
            {allTechStacks.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-4 py-2 text-sm font-mono rounded-full border transition-colors ${
                  selectedTech === tech
                    ? 'bg-brand-blue text-black border-brand-blue'
                    : 'bg-transparent text-gray-400 border-white/20 hover:border-brand-blue hover:text-white'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-6 text-sm text-gray-500">
        {selectedTech ? (
          <span>
            Showing <span className="text-brand-blue">{filteredProjects.length}</span> project{filteredProjects.length !== 1 ? 's' : ''} using <span className="text-white">{selectedTech}</span>
          </span>
        ) : (
          <span>
            Showing all <span className="text-brand-blue">{filteredProjects.length}</span> projects
          </span>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="group cursor-pointer project-card flex flex-col h-full"
            >
              <div className="relative overflow-hidden aspect-[16/10] mb-6 border border-white/10 group-hover:border-brand-blue transition-colors duration-300 shrink-0">
                {project.thumbnail_url ? (
                  <img 
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700" 
                  />
                ) : (
                  <div className="w-full h-full bg-brand-gray flex items-center justify-center">
                    <span className="text-brand-white/20 font-display text-4xl">{project.title[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-blue flex items-center justify-center text-black text-2xl rotate-45 group-hover:rotate-0 transition-transform duration-500">
                    <ArrowRight size={32} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl md:text-3xl font-display font-bold group-hover:text-brand-blue transition-colors">
                    {project.title}
                  </h3>
                  <span className="px-3 py-1 border border-white/20 rounded-full text-xs uppercase shrink-0">
                    {new Date(project.project_date || project.created_at).getFullYear()}
                  </span>
                </div>
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.slice(0, 4).map((tech, i) => (
                      <span 
                        key={i} 
                        className={`text-xs font-mono px-2 py-1 rounded ${
                          selectedTech === tech 
                            ? 'bg-brand-blue/20 text-brand-blue' 
                            : 'text-gray-400 bg-white/5'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack.length > 4 && (
                      <span className="text-xs font-mono text-gray-500 px-1 py-1">
                        +{project.tech_stack.length - 4}
                      </span>
                    )}
                  </div>
                )}
                <p className="text-gray-400 text-sm line-clamp-2 mt-auto">
                  {stripHtml(project.description)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
          <p className="text-brand-white/40 text-lg">
            No projects found with <span className="text-brand-blue">{selectedTech}</span>
          </p>
          <button
            onClick={() => setSelectedTech(null)}
            className="mt-4 text-brand-blue hover:underline"
          >
            Clear filter
          </button>
        </div>
      )}
    </>
  );
}
