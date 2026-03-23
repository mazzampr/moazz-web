'use client';

import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero2() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let scrollAmount = 0;
    const speed = 0.5;
    let animationId: number;

    const scroll = () => {
      scrollAmount -= speed;
      // Reset when first set of text moves out completely
      if (Math.abs(scrollAmount) >= marquee.scrollWidth / 2) {
        scrollAmount = 0;
      }
      marquee.style.transform = `translateX(${scrollAmount}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center mt-5 pt-20 overflow-hidden bg-brand-black">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

      {/* Animated Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[100px] animate-pulse" />

      <div className="container mx-auto px-6 md:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="w-full lg:w-1/2">
            <div className="flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gray border border-brand-blue/30 rounded-full mb-8">
                <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse" />
                <span className="text-sm font-medium text-brand-blue">Available for remote jobs</span>
              </div>
            </div>
            <img
              src="/images/avatar-me.png"
              alt="Hero Mobile"
              className="w-40 text-center mx-auto d-block md:hidden mb-8"
            />
            <div className="overflow-hidden text-center lg:text-left mx-auto lg:mx-0">
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-8 animate-fade-in-up opacity-0"
                style={{ animationDelay: '0.2s' }}
              >
                CREATIVE <br />
                <span className="text-outline text-outline-hover transition-all duration-500 cursor-default">
                  FULLSTACK
                </span>
                <br />
                MOBILE DEV.
              </h1>
            </div>
            <div className="overflow-hidden text-center lg:text-left">
              <p
                className="text-lg md:text-xl text-gray-400 max-w-xl mb-10 font-light animate-fade-in-up opacity-0 mx-auto lg:mx-0"
                style={{ animationDelay: '0.4s' }}
              >
                I craft digital experiences that blend aesthetics with functionality. <span className="text-white font-bold border-b-2 border-brand-blue">Specializing </span> in build modern mobile applications.
              </p>
            </div>

            <div
              className="flex flex-wrap justify-center lg:justify-start gap-6 animate-fade-in-up opacity-0"
              style={{ animationDelay: '0.6s' }}
            >
              <a
                href="https://wa.me/6281234567890"
                className="btn-brutal px-8 py-4 bg-white text-black font-bold text-lg uppercase tracking-wider inline-flex items-center gap-2 group hover:bg-brand-blue transition-colors"
              >
                Start Project
                <ArrowRight
                  size={20}
                  className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
                />
              </a>
              <Link
                href="#work"
                className="px-8 py-4 border border-white/20 text-white font-bold text-lg uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                View Work
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end animate-fade-in-up opacity-0" style={{ animationDelay: '0.8s' }}>
            <img
              src="/images/hero-zams.png"
              alt="Hero Mobile"
              className="w-60 md:w-96 lg:w-full max-w-[500px] hidden lg:block"
            />
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="w-full border-y border-white/10 bg-brand-black/50 backdrop-blur-sm overflow-hidden mt-0 lg:mt-10 py-4">
        <div ref={marqueeRef} className="flex whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="font-display font-bold text-4xl text-white/10 uppercase px-4">
                Web Design • Development • UI/UX • Branding • Strategy •
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
