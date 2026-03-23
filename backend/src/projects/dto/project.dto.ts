import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Portfolio Website', description: 'Project title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'A modern portfolio website built with Next.js and NestJS',
    description: 'Project description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'portfolio-website', description: 'URL-friendly slug' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({
    example: 'https://storage.supabase.com/images/project.jpg',
    description: 'Thumbnail image URL',
  })
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @ApiProperty({
    example: ['Next.js', 'NestJS', 'Tailwind CSS'],
    description: 'Array of technologies used',
  })
  @IsArray()
  @IsString({ each: true })
  tech_stack: string[];

  @ApiPropertyOptional({
    example: 'https://myproject.com',
    description: 'Live demo URL',
  })
  @IsOptional()
  @IsString()
  demo_url?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/username/project',
    description: 'Repository URL',
  })
  @IsOptional()
  @IsString()
  repo_url?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether to feature this project on the homepage',
  })
  @IsOptional()
  is_featured?: boolean;

  @ApiPropertyOptional({
    example: '2024-06-15',
    description: 'Date when the project was created/completed',
  })
  @IsOptional()
  @IsString()
  project_date?: string;
}

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'Updated Portfolio' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'updated-portfolio' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @ApiPropertyOptional({ example: ['React', 'Node.js'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech_stack?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  demo_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  repo_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  is_featured?: boolean;

  @ApiPropertyOptional({
    example: '2024-06-15',
    description: 'Date when the project was created/completed',
  })
  @IsOptional()
  @IsString()
  project_date?: string;
}
