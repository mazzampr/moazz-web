import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Article } from '@/types';
import Link from 'next/link';
import { ArrowRight, Calendar } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  let articles: Article[] = [];

  try {
    articles = await api.articles.getAll();
    // Sort articles by published date descending
    articles = articles
      .filter((a) => a.is_published)
      .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
  } catch (error) {
    console.error('Error fetching articles:', error);
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 px-6 min-h-screen bg-brand-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 border-b border-white/10 pb-8">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
              All <span className="text-brand-blue">Articles</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl">
              Thoughts, tutorials, and insights on web development, design, and software engineering.
            </p>
          </div>

          {/* Articles Grid */}
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  href={`/articles/${article.slug}`}
                  key={article.id}
                  className="group card-brutal bg-brand-gray p-6 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="flex items-center gap-2 mb-4 text-brand-blue">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                        : 'Draft'}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-2xl text-brand-white mb-3 group-hover:text-brand-blue transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-brand-white/70 text-sm line-clamp-4 mb-6 flex-grow">
                    {article.content.replace(/[#*`_\[\]]/g, '').substring(0, 200)}...
                  </p>
                  <span className="text-sm text-brand-blue font-medium group-hover:underline mt-auto inline-flex items-center gap-1">
                    Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
              <p className="text-brand-white/40 text-lg">No articles published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
