import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { Article, Category } from '@/types';
import ArticlesClient from './ArticlesClient';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
  let articles: Article[] = [];
  let categories: Category[] = [];

  try {
    const [fetchedArticles, fetchedCategories] = await Promise.all([
      api.articles.getAll(),
      api.categories.getAll()
    ]);
    
    // Sort articles by published date descending
    articles = (fetchedArticles || [])
      .filter((a: Article) => a.is_published)
      .sort((a: Article, b: Article) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    categories = fetchedCategories || [];
  } catch (error) {
    console.error('Error fetching articles data:', error);
  }

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-20 px-6 min-h-screen bg-brand-black">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 border-b border-white/10 pb-8 text-center">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
              All <span className="text-brand-blue">Articles</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Thoughts, tutorials, and insights on web development, design, and software engineering.
            </p>
          </div>

          <ArticlesClient initialArticles={articles} categories={categories} />
        </div>
      </main>

      <Footer />
    </>
  );
}
