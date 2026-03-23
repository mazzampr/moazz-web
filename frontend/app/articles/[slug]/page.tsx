import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Article } from '@/types';

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
          <header className="mb-12 border-b border-white/10 pb-10">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-brand-blue" />
                <span>
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'Draft'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} className="text-brand-blue" />
                <span>Moazz</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-brand-blue hover:prose-a:text-brand-lime prose-a:transition-colors prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-hr:border-white/10 prose-blockquote:border-brand-blue prose-blockquote:bg-brand-blue/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {article.content}
            </ReactMarkdown>
          </div>
          
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
