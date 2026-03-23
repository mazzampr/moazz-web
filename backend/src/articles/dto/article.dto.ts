import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Getting Started with NestJS', description: 'Article title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ example: 'getting-started-with-nestjs', description: 'URL-friendly slug' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiProperty({
    example: '# Introduction\n\nNestJS is a powerful framework...',
    description: 'Article content in Markdown format',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the article is published',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_published?: boolean;

  @ApiPropertyOptional({
    example: '2024-01-15T10:00:00Z',
    description: 'Publication date',
  })
  @IsOptional()
  @IsDateString()
  published_at?: string;
}

export class UpdateArticleDto {
  @ApiPropertyOptional({ example: 'Updated Article Title' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'updated-article-slug' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({ example: '# Updated Content...' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_published?: boolean;

  @ApiPropertyOptional({ example: '2024-02-01T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  published_at?: string;
}
