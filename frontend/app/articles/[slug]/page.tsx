import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleContent from '@/components/ArticleContent';
import { api } from '@/lib/api';
import { Article } from '@/types';
import 'quill/dist/quill.snow.css';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export default async function ArticleDetailPage({ params }: Props) {
  let article: Article | null = null;
  const { slug } = await params;

  try {
    article = await api.articles.getBySlug(slug);
  } catch (error) {
    console.error('Error fetching article:', error);
  }

  if (!article) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 px-6 min-h-screen bg-brand-black">
        <article className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-blue mb-10 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Articles</span>
          </Link>

          {/* Article Header */}
          <header className="border-b border-white/10 pb-10">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-brand-blue" />
                <span>
                  {new Date(article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-brand-blue" />
                <span>Moazz</span>
              </div>
            </div>

            {/* Categories */}
            {article.categories && article.categories.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-6">
                {article.categories.map((cat) => (
                  <span 
                    key={cat.id} 
                    className="px-4 py-1.5 bg-brand-gray/50 border border-white/10 rounded-full text-brand-white text-sm font-medium"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <ArticleContent content={article.content} />
          
          {/* Article Footer */}
          <footer className="mt-20 pt-10 border-t border-white/10 text-center">
            <p className="text-gray-400 mb-6">Thanks for reading! Share this article if you found it helpful.</p>
            <Link
              href="/articles"
              className="inline-block px-8 py-4 bg-brand-gray border border-white/10 text-white font-medium hover:border-brand-blue transition-colors rounded-full"
            >
              Read More Articles
            </Link>
          </footer>
        </article>
      </main>

      <Footer />
    </>
  );
}
