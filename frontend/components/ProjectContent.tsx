'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';

interface ProjectContentProps {
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  description?: string;
}

export default function ProjectContent({ thumbnailUrl, thumbnailAlt, description }: ProjectContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

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

  // Add click handlers to images in description after mount
  useEffect(() => {
    const container = descriptionRef.current;
    if (!container || !description) return;

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
  }, [description, openLightbox]);

  return (
    <>
      {/* Thumbnail Image */}
      {thumbnailUrl && (
        <div 
          className="relative aspect-[16/10] bg-[#1a1a1a] rounded-sm overflow-hidden border border-white/10 shadow-2xl cursor-pointer group"
          onClick={() => openLightbox(thumbnailUrl)}
        >
          <img
            src={thumbnailUrl}
            alt={thumbnailAlt || 'Project Preview'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium bg-black/50 px-3 py-1.5 rounded">
              Click to enlarge
            </span>
          </div>
        </div>
      )}

      {/* Description Content */}
      {description && (
        <div 
          ref={descriptionRef}
          className="prose prose-invert prose-lg prose-justify max-w-none text-gray-300 leading-relaxed font-sans prose-p:mb-5 prose-p:text-lg prose-img:cursor-pointer prose-img:transition-opacity hover:prose-img:opacity-80"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

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
