import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsList from '@/components/ProjectsList';
import { api } from '@/lib/api';
import { Project } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let projects: Project[] = [];

  try {
    projects = await api.projects.getAll();
    // Sort projects descending by project date
    projects = projects.sort((a, b) => 
      new Date(b.project_date || b.created_at).getTime() - new Date(a.project_date || a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 px-6 min-h-screen bg-brand-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 uppercase">
              All <span className="text-brand-blue">Projects</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              A complete archive of my professional and personal work.
            </p>
          </div>

          {/* Projects List with Filtering */}
          <ProjectsList projects={projects} />
        </div>
      </main>

      <Footer />
    </>
  );
}
