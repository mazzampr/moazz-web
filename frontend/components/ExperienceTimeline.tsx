'use client';

import { Experience } from '@/types';
import { formatDateRange } from '@/lib/date';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  return (
    <div className="relative mx-0">
      {/* Vertical Line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-brand-gray md:-translate-x-px" />

      {/* Timeline Items */}
      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <div
            key={exp.id}
            className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
              }`}
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-brand-blue border-4 border-brand-black rounded-full md:-translate-x-1/2 z-10" />

            {/* Content */}
            <div className={`flex-1 pl-8 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-4' : 'md:pl-4'}`}>
              {/* Period */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gray border border-brand-blue/30 rounded-full mb-4">
                <span className="text-xs font-medium text-brand-blue">
                  {formatDateRange(exp.start_date, exp.end_date)}
                </span>
              </div>

              {/* Company & Position */}
              <h3 className="font-display font-bold text-2xl text-brand-white mb-2">
                {exp.position}
              </h3>
              <h4 className="text-lg text-brand-blue mb-4">{exp.company}</h4>

              {/* Description */}
              <p className="text-brand-white/70 mb-4 leading-relaxed">
                {exp.description}
              </p>
            </div>

            {/* Spacer for alternating layout */}
            <div className="hidden md:block flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
