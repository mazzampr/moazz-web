'use client';

import { useEffect, useRef } from 'react';

export default function Hero() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple marquee animation
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let scrollAmount = 0;
    const scroll = () => {
      scrollAmount -= 1;
      if (Math.abs(scrollAmount) >= marquee.scrollWidth / 2) {
        scrollAmount = 0;
      }
      marquee.style.transform = `translateX(${scrollAmount}px)`;
      requestAnimationFrame(scroll);
    };
    scroll();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-40" />

      {/* Gradient Blob */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[150px] animate-pulse" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gray border border-brand-blue/30 rounded-full mb-8">
          <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
          <span className="text-sm font-medium text-brand-blue">Available for freelance</span>
        </div>

        {/* Main Heading */}
        <h1 className="font-display font-bold text-6xl md:text-8xl lg:text-9xl mb-6 leading-none">
          <span className="block text-brand-white">Creative</span>
          <span className="block text-outline text-outline-hover">Developer</span>
          <span className="block text-brand-blue">& Designer</span>
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-brand-white/70 max-w-2xl mx-auto mb-12">
          I craft digital experiences that blend aesthetics with functionality.
          Specializing in full-stack development and modern web technologies.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="#work"
            className="px-8 py-4 bg-brand-blue text-brand-black font-bold btn-brutal text-lg"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="px-8 py-4 bg-transparent border-2 border-brand-white text-brand-white font-bold hover:bg-brand-white hover:text-brand-black transition-all text-lg"
          >
            Get In Touch
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="font-display font-bold text-4xl md:text-5xl text-brand-blue mb-2">5+</div>
            <div className="text-sm text-brand-white/60">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-4xl md:text-5xl text-brand-blue mb-2">50+</div>
            <div className="text-sm text-brand-white/60">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-4xl md:text-5xl text-brand-blue mb-2">30+</div>
            <div className="text-sm text-brand-white/60">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-4xl md:text-5xl text-brand-blue mb-2">15+</div>
            <div className="text-sm text-brand-white/60">Awards Won</div>
          </div>
        </div>
      </div>

      {/* Scrolling Ticker */}
      <div className="absolute bottom-0 left-0 right-0 py-6 bg-brand-blue overflow-hidden">
        <div ref={marqueeRef} className="flex whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              <span className="font-display font-bold text-2xl text-brand-black">FULL-STACK DEVELOPER</span>
              <span className="text-brand-black">•</span>
              <span className="font-display font-bold text-2xl text-brand-black">UI/UX DESIGNER</span>
              <span className="text-brand-black">•</span>
              <span className="font-display font-bold text-2xl text-brand-black">CREATIVE CODER</span>
              <span className="text-brand-black">•</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
