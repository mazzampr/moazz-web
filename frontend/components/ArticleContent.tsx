'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const openLightbox = useCallback((src: string) => {
    setCurrentImage(src);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setCurrentImage(null);
    document.body.style.overflow = 'unset';
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };

    if (lightboxOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxOpen, closeLightbox]);

  // Add click handlers to images after mount
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const images = container.querySelectorAll('img');
    
    const handleImageClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      const img = e.currentTarget as HTMLImageElement;
      openLightbox(img.src);
    };

    images.forEach((img) => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', handleImageClick);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('click', handleImageClick);
      });
    };
  }, [content, openLightbox]);

  return (
    <>
      {/* Article Content */}
      <div 
        ref={contentRef}
        className="prose prose-invert prose-lg prose-justify max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-brand-blue hover:prose-a:text-brand-lime prose-a:transition-colors prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-img:cursor-pointer prose-img:transition-opacity hover:prose-img:opacity-80 prose-hr:border-white/10 prose-blockquote:border-brand-blue prose-blockquote:bg-brand-blue/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg ql-editor [&_img]:inline-block [&_img]:mx-2 [&_img]:my-0"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Lightbox Modal */}
      {lightboxOpen && currentImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white bg-black/50 rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Image Container */}
          <div 
            className="relative max-w-[90vw] max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt="Enlarged view"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Click anywhere to close hint */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-sm">
            Press ESC or click outside to close
          </p>
        </div>
      )}
    </>
  );
}
