'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Search } from 'lucide-react';
import { Article, Category } from '@/types';

interface ArticlesClientProps {
  initialArticles: Article[];
  categories: Category[];
}

export default function ArticlesClient({ initialArticles, categories }: ArticlesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter articles down based on search text and category selection
  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      // Filter by Search Query
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (article.content && article.content.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by Category
      const matchesCategory = selectedCategory 
        ? article.categories?.some((cat) => cat.slug === selectedCategory) 
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [initialArticles, searchQuery, selectedCategory]);

  return (
    <>
      <div className="mb-12">
        {/* Search Bar */}
        <div className="flex flex-col items-center justify-center mb-10 mt-10">
          <h2 className="text-3xl font-bold text-white mb-6">Explore topics</h2>
          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-blue transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search all topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-black font-medium pl-14 pr-6 py-4 rounded-full text-lg outline-none focus:ring-4 focus:ring-brand-blue/30 transition-shadow"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-gray-400 font-medium mr-2">Recommended:</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-brand-blue text-black'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-blue text-black'
                    : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link
              href={`/articles/${article.slug}`}
              key={article.id}
              className="group card-brutal bg-brand-gray p-6 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Category Small Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {article.categories?.slice(0, 2).map((cat) => (
                  <span key={cat.id} className="text-xs bg-white/10 text-brand-blue px-2 py-1 rounded-md font-medium">
                    {cat.name}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4 text-gray-400">
                <Calendar size={14} />
                <span className="text-xs font-medium">
                  {new Date(article.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl text-brand-white mb-3 group-hover:text-brand-blue transition-colors">
                {article.title}
              </h3>
              <p className="text-brand-white/70 text-sm line-clamp-4 mb-6 flex-grow">
                {/* Extract plaintext quickly without HTML tags */}
                {article.content.replace(/<[^>]*>?/gm, '').substring(0, 200)}...
              </p>
              <span className="text-sm text-brand-blue font-medium group-hover:underline mt-auto inline-flex items-center gap-1">
                Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
          <p className="text-brand-white/40 text-lg">No articles found matching your criteria.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
            className="mt-4 text-brand-blue underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}