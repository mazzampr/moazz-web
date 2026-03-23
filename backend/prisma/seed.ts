import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.article.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();

  // Seed Projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'E-Commerce Platform',
        description:
          'A full-stack e-commerce platform with real-time inventory management, payment processing, and order tracking. Built with modern technologies for optimal performance.',
        slug: 'ecommerce-platform',
        thumbnail_url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028',
        tech_stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Redis'],
        demo_url: 'https://ecommerce-demo.vercel.app',
        repo_url: 'https://github.com/moazz/ecommerce-platform',
      },
    }),
    prisma.project.create({
      data: {
        title: 'Real-Time Chat Application',
        description:
          'A scalable chat application featuring real-time messaging, typing indicators, read receipts, and file sharing. Supports group chats and direct messages.',
        slug: 'realtime-chat-app',
        thumbnail_url: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da',
        tech_stack: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'Express', 'JWT'],
        demo_url: 'https://chat-app-demo.vercel.app',
        repo_url: 'https://github.com/moazz/chat-application',
      },
    }),
    prisma.project.create({
      data: {
        title: 'Task Management Dashboard',
        description:
          'A comprehensive project management tool with Kanban boards, Gantt charts, team collaboration features, and advanced analytics. Perfect for agile teams.',
        slug: 'task-management-dashboard',
        thumbnail_url: 'https://images.unsplash.com/photo-1611224885990-ab7363d1f2b5',
        tech_stack: ['Vue.js', 'Tailwind CSS', 'Firebase', 'Chart.js', 'Vuex'],
        demo_url: 'https://taskboard-demo.vercel.app',
        repo_url: 'https://github.com/moazz/task-dashboard',
      },
    }),
    prisma.project.create({
      data: {
        title: 'Weather Forecast App',
        description:
          'A beautiful weather application providing real-time weather data, 7-day forecasts, weather maps, and location-based alerts. Built with a focus on UI/UX.',
        slug: 'weather-forecast-app',
        thumbnail_url: 'https://images.unsplash.com/photo-1592210454359-9043f067919b',
        tech_stack: ['React Native', 'TypeScript', 'OpenWeather API', 'Redux', 'Expo'],
        demo_url: 'https://weather-app-demo.vercel.app',
        repo_url: 'https://github.com/moazz/weather-app',
      },
    }),
    prisma.project.create({
      data: {
        title: 'AI Content Generator',
        description:
          'An AI-powered content generation platform using GPT-4 for creating blog posts, social media content, and marketing copy. Includes SEO optimization tools.',
        slug: 'ai-content-generator',
        thumbnail_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
        tech_stack: ['Next.js', 'OpenAI API', 'Tailwind CSS', 'Supabase', 'Vercel AI SDK'],
        demo_url: 'https://ai-content-demo.vercel.app',
        repo_url: 'https://github.com/moazz/ai-content-generator',
      },
    }),
    prisma.project.create({
      data: {
        title: 'Fitness Tracking App',
        description:
          'A mobile fitness tracker with workout logging, progress tracking, nutrition planning, and social features. Integrates with popular wearables.',
        slug: 'fitness-tracking-app',
        thumbnail_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
        tech_stack: ['Flutter', 'Dart', 'Firebase', 'HealthKit', 'Google Fit API'],
        demo_url: 'https://fitness-app-demo.vercel.app',
        repo_url: 'https://github.com/moazz/fitness-tracker',
      },
    }),
  ]);

  console.log(`✅ Created ${projects.length} projects`);

  // Seed Experiences
  const experiences = await Promise.all([
    prisma.experience.create({
      data: {
        position: 'Senior Full-Stack Developer',
        company: 'TechCorp Solutions',
        start_date: new Date('2022-01-01'),
        description:
          'Led development of enterprise-scale web applications using modern JavaScript frameworks. Mentored junior developers and conducted code reviews. Implemented CI/CD pipelines and improved deployment processes, reducing deployment time by 60%.',
        order: 1,
      },
    }),
    prisma.experience.create({
      data: {
        position: 'Full-Stack Developer',
        company: 'StartupX Inc.',
        start_date: new Date('2020-03-01'),
        end_date: new Date('2021-12-01'),
        description:
          'Built and maintained multiple client projects using React, Node.js, and MongoDB. Collaborated with designers to create pixel-perfect, responsive interfaces. Improved application performance by 40% through code optimization and lazy loading.',
        order: 2,
      },
    }),
    prisma.experience.create({
      data: {
        position: 'Frontend Developer',
        company: 'Digital Agency Pro',
        start_date: new Date('2018-06-01'),
        end_date: new Date('2020-02-01'),
        description:
          'Developed responsive websites and single-page applications for various clients. Worked closely with UI/UX designers to implement designs with high fidelity. Introduced modern build tools and workflows to improve development efficiency.',
        order: 3,
      },
    }),
    prisma.experience.create({
      data: {
        position: 'Junior Web Developer',
        company: 'WebDev Studios',
        start_date: new Date('2017-01-01'),
        end_date: new Date('2018-05-01'),
        description:
          'Started career building static websites and WordPress themes. Learned web development fundamentals and best practices. Contributed to team projects and participated in daily standups and sprint planning.',
        order: 4,
      },
    }),
  ]);

  console.log(`✅ Created ${experiences.length} experiences`);

  // Seed Articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'Getting Started with Next.js 15: A Complete Guide',
        slug: 'getting-started-nextjs-15',
        content: `
# Getting Started with Next.js 15: A Complete Guide

Next.js 15 brings exciting new features and improvements to the React ecosystem. In this comprehensive guide, we'll explore the latest features and how to get started with building modern web applications.

## What's New in Next.js 15?

Next.js 15 introduces several groundbreaking features:

1. **Turbopack by default** - Faster build times and improved developer experience
2. **React Server Components** - Enhanced server-side rendering capabilities
3. **Improved routing** - More intuitive and powerful App Router
4. **Better performance** - Optimized bundle sizes and faster page loads

## Installation

Getting started is simple:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Creating Your First Page

With the App Router, creating pages is intuitive...

[Content continues...]
        `,
        is_published: true,
        published_at: new Date('2024-01-15'),
      },
    }),
    prisma.article.create({
      data: {
        title: 'Building Scalable APIs with NestJS and Prisma',
        slug: 'building-scalable-apis-nestjs-prisma',
        content: `
# Building Scalable APIs with NestJS and Prisma

Learn how to build production-ready, type-safe APIs using NestJS and Prisma ORM. This guide covers everything from setup to deployment.

## Why NestJS + Prisma?

The combination of NestJS and Prisma provides:
- End-to-end type safety
- Modern development experience
- Scalable architecture
- Built-in best practices

## Project Setup

Start by installing the necessary packages...

[Content continues...]
        `,
        is_published: true,
        published_at: new Date('2024-01-10'),
      },
    }),
    prisma.article.create({
      data: {
        title: 'Mastering Tailwind CSS: Tips and Tricks',
        slug: 'mastering-tailwind-css',
        content: `
# Mastering Tailwind CSS: Tips and Tricks

Tailwind CSS has revolutionized how we write CSS. Here are some advanced tips and tricks to level up your Tailwind game.

## Custom Configurations

Extend Tailwind's default theme to match your brand...

## Component Patterns

Learn reusable component patterns that make your code more maintainable...

[Content continues...]
        `,
        is_published: true,
        published_at: new Date('2024-01-05'),
      },
    }),
    prisma.article.create({
      data: {
        title: 'TypeScript Best Practices for React Developers',
        slug: 'typescript-best-practices-react',
        content: `
# TypeScript Best Practices for React Developers

TypeScript and React are a powerful combination. Learn the best practices for writing type-safe React applications.

## Type Safety in Components

Properly typing your React components ensures...

[Content continues...]
        `,
        is_published: true,
        published_at: new Date('2024-01-01'),
      },
    }),
    prisma.article.create({
      data: {
        title: 'Understanding React Server Components',
        slug: 'understanding-react-server-components',
        content: `
# Understanding React Server Components

React Server Components are changing how we think about React applications. This article explains the concept and practical applications.

[Content continues...]
        `,
        is_published: false,
      },
    }),
  ]);

  console.log(`✅ Created ${articles.length} articles`);

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
