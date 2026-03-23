'use client';

import { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block card-brutal bg-brand-gray rounded-none overflow-hidden"
    >
      {/* Project Image */}
      <div className="relative aspect-video overflow-hidden bg-brand-black">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-gray to-brand-black">
            <span className="font-display font-bold text-6xl text-brand-white/10">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/60 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-display font-bold text-brand-blue text-xl">
            View Project →
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        {/* Project Number */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-display font-bold text-brand-blue text-sm">
            PROJECT #{String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-xs text-brand-white/40">
            {new Date(project.created_at).getFullYear()}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-2xl text-brand-white mb-3 group-hover:text-brand-blue transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-brand-white/70 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {Array.isArray(project.tech_stack) &&
            project.tech_stack.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-brand-black border border-brand-gray text-brand-white/80 text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          {Array.isArray(project.tech_stack) && project.tech_stack.length > 4 && (
            <span className="px-3 py-1 bg-brand-black border border-brand-gray text-brand-blue text-xs font-medium">
              +{project.tech_stack.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        {(project.demo_url || project.repo_url) && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-brand-gray">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-white/60 hover:text-brand-blue transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Live Demo →
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-brand-white/60 hover:text-brand-blue transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub →
              </a>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
