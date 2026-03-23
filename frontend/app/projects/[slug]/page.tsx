import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Github, Calendar, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export default async function ProjectDetailPage({ params }: Props) {
  let project: Project | null = null;
  const { slug } = await params;

  try {
    project = await api.projects.getBySlug(slug);
  } catch (error) {
    console.error('Error fetching project:', error);
  }

  if (!project) {
    notFound();
  }

  const projectYear = new Date(project.project_date || project.created_at).getFullYear();

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 px-6 min-h-screen bg-brand-black">
        <article className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-blue mb-10 transition-colors uppercase tracking-wider text-xs font-semibold"
          >
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </Link>

          {/* Project Title */}
          <header className="mb-12">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 leading-tight">
              {project.title}
            </h1>

          </header>

          {/* Top Section: Image Left + Tech/Links Right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-16">
            {/* Image — Left (3/5) */}
            <div className="lg:col-span-3">
              <div className="relative aspect-[16/10] bg-[#1a1a1a] rounded-sm overflow-hidden border border-white/10 shadow-2xl">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={`${project.title} Preview`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/10 font-display text-8xl">{project.title[0]}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info — Right (2/5) */}
            <div className="lg:col-span-2 flex flex-col justify-between">
              {/* Tech Stack */}
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-widest text-brand-blue font-bold mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech_stack?.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 text-sm font-mono rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Info */}
              <div className="mb-8">
                <h3 className="text-sm uppercase tracking-widest text-brand-blue font-bold mb-4">Details</h3>
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex justify-between">
                    <span>Year</span>
                    <span className="text-white font-mono">{projectYear}</span>
                  </div>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-col gap-3 mt-auto">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-brand-black font-bold uppercase tracking-wider text-sm hover:bg-brand-white transition-colors w-full"
                  >
                    <span>View Live</span>
                    <ExternalLink size={16} />
                  </a>
                )}
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/10 transition-colors w-full"
                  >
                    <Github size={16} />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section: Full-width Description */}
          <section className="pt-6">
            <h3 className="text-sm uppercase tracking-widest text-brand-blue font-bold mb-6">About the Project</h3>
            <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed font-sans">
              {project.description.split('\n').map((paragraph, index) => (
                paragraph.trim() ? <p key={index} className="mb-5 text-lg">{paragraph}</p> : null
              ))}
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
