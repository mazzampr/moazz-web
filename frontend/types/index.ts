// Type definitions matching backend DTOs

export interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail_url?: string;
  tech_stack: string[];
  demo_url?: string;
  repo_url?: string;
  is_featured?: boolean;
  project_date?: string;
  created_at: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  start_date: string;
  end_date?: string;
  description: string;
  order: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
  categories?: Category[];
}

export interface CreateProjectDto {
  title: string;
  description: string;
  slug: string;
  thumbnail_url?: string;
  tech_stack: string[];
  demo_url?: string;
  repo_url?: string;
}

export interface CreateExperienceDto {
  position: string;
  company: string;
  start_date: string;
  end_date?: string;
  description: string;
  order?: number;
}

export interface CreateArticleDto {
  title: string;
  slug: string;
  content: string;
  is_published?: boolean;
  published_at?: string;
}
