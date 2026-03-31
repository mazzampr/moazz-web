import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import ExperienceTimeline from '@/components/ExperienceTimeline';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Project, Experience, Article } from '@/types';
import Hero2 from '@/components/Hero2';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function getPlainTextExcerpt(content: string, maxLength: number = 150) {
  const plainText = content
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.substring(0, maxLength).trim()}...`;
}

export default async function Home() {
  // Fetch data from backend
  let projects: Project[] = [];
  let experiences: Experience[] = [];
  let articles: Article[] = [];

  try {
    [projects, experiences, articles] = await Promise.all([
      api.projects.getAll(),
      api.experiences.getAll(),
      api.articles.getAll(),
    ]);
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <>
      <Navbar />
      <Hero2 />

      {/* Projects Section */}
      <section id="work" className="py-32 relative bg-brand-black">
        <div className="container mx-auto px-6 md:px-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
            <h2 className="text-5xl md:text-7xl font-display font-bold">SELECTED <br /> <span
              className="text-brand-blue">WORKS</span></h2>
            <p className="text-gray-400 mt-4 md:mt-0 max-w-xs text-right">Curated projects that define my standard of
              quality.</p>
          </div>

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {projects
                  .filter((p) => p.is_featured)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 6)
                  .map((project, index) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.slug}`}
                      className={`group cursor-pointer project-card ${index % 2 !== 0 ? 'md:mt-20' : ''}`}
                    >
                      <div
                        className="relative overflow-hidden aspect-[4/3] mb-6 border border-white/10 group-hover:border-brand-blue transition-colors duration-300">
                        {project.thumbnail_url ? (
                          <img src={project.thumbnail_url}
                            alt={project.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700" />
                        ) : (
                          <div className="w-full h-full bg-brand-gray flex items-center justify-center">
                            <span className="text-brand-white/20 font-display text-4xl">{project.title[0]}</span>
                          </div>
                        )}
                        <div
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div
                            className="w-20 h-20 rounded-full bg-brand-blue flex items-center justify-center text-black text-2xl rotate-45 group-hover:rotate-0 transition-transform duration-500">
                            <ArrowRight size={32} />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-3xl font-display font-bold mb-1 group-hover:text-brand-blue transition-colors">{project.title}</h3>
                          <p className="text-gray-400 font-mono text-sm">{project.tech_stack?.length ? project.tech_stack.slice(0, 3).join(' / ') : 'Development'}</p>
                        </div>
                        <span className="px-3 py-1 border border-white/20 rounded-full text-xs uppercase">{new Date(project.project_date || project.created_at).getFullYear()}</span>
                      </div>
                    </Link>
                  ))}
              </div>

              <div className="text-center">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-brand-white/20 text-brand-white font-medium hover:bg-brand-white hover:text-brand-black transition-colors rounded-full uppercase tracking-wider text-sm"
                >
                  View All My Work <ArrowRight size={18} />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-brand-white/40 text-lg">No projects yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 bg-brand-gray/30">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="font-display font-bold text-5xl md:text-7xl text-brand-white mb-4">
              Experience <span className="text-brand-blue">Timeline</span>
            </h2>
            <p className="text-brand-white/60 text-lg max-w-2xl mx-auto">
              My professional journey and the amazing companies I've worked with.
            </p>
          </div>

          {/* Timeline */}
          {experiences.length > 0 ? (
            <ExperienceTimeline 
              experiences={[...experiences].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())} 
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-brand-white/40 text-lg">No experience entries yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-20 bg-brand-black">
        <div className="container mx-auto px-6 md:px-24">
          {/* Section Header */}
          <div className="mb-12">
            <h2 className="font-display font-bold text-5xl md:text-7xl text-brand-white mb-4">
              Latest <span className="text-brand-blue">Articles</span>
            </h2>
            <p className="text-brand-white/60 text-lg max-w-2xl">
              Thoughts, tutorials, and insights on web development and design.
            </p>
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {articles
                  .filter((article) => article.is_published)
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 3)
                  .map((article) => (
                    <Link
                      href={`/articles/${article.slug}`}
                      key={article.id}
                      className="group card-brutal bg-brand-gray p-6 flex flex-col h-full"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs text-brand-blue font-medium">
                          {article.published_at
                            ? new Date(article.published_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                            : 'Draft'}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-2xl text-brand-white mb-3 group-hover:text-brand-blue transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-brand-white/70 text-sm line-clamp-3 mb-6 flex-grow">
                        {getPlainTextExcerpt(article.content)}
                      </p>
                      <span className="text-sm text-brand-blue group-hover:underline mt-auto inline-flex items-center gap-1">
                        Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  ))}
              </div>
              <div className="text-center">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-brand-white/20 text-brand-white font-medium hover:bg-brand-white hover:text-brand-black transition-colors rounded-full"
                >
                  View All Articles <ArrowRight size={18} />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-brand-white/40 text-lg">No articles published yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-brand-gray/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display font-bold text-5xl md:text-7xl text-brand-white mb-6">
            Let's Create Something <span className="text-brand-blue">Together</span>
          </h2>
          <p className="text-brand-white/60 text-lg mb-8 max-w-2xl mx-auto">
            Have a project in mind? I'm always open to discussing new opportunities,
            creative ideas, or partnerships.
          </p>
          <a
            href="mailto:mohazzampriyanto@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-brand-blue text-brand-black font-bold btn-brutal text-lg"
          >
            Get In Touch
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
