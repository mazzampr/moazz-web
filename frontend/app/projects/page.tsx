import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Project } from '@/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let projects: Project[] = [];

  try {
    projects = await api.projects.getAll();
    // Sort projects descending by created date
    projects = projects.sort((a, b) => new Date(b.project_date || b.created_at).getTime() - new Date(a.project_date || a.created_at).getTime());
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 px-6 min-h-screen bg-brand-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 uppercase">
                All <span className="text-brand-blue">Projects</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl">
                A complete archive of my professional and personal work.
              </p>
            </div>
            <div className="mt-8 md:mt-0 pb-2">
              <span className="text-brand-blue font-mono">{projects.length} Works Available</span>
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {projects.map((project) => (
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
                          <span key={i} className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
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
                      {project.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
              <p className="text-brand-white/40 text-lg">No projects published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
