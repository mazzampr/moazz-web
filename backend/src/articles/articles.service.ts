import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(publishedOnly: boolean = true, categorySlug?: string) {
    const where: any = {};
    if (publishedOnly) {
      where.is_published = true;
    }
    if (categorySlug) {
      where.categories = {
        some: { slug: categorySlug }
      };
    }

    return this.prisma.article.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        categories: true,
      },
    });
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: { categories: true },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    return article;
  }

  async findById(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID "${id}" not found`);
    }

    return article;
  }

  async create(data: CreateArticleDto) {
    const { categoryIds, ...restData } = data;
    
    return this.prisma.article.create({
      data: {
        ...restData,
        published_at: restData.published_at ? new Date(restData.published_at) : null,
        categories: {
          connect: categoryIds?.map(id => ({ id })) || [],
        }
      },
      include: { categories: true },
    });
  }

  async update(id: string, data: UpdateArticleDto) {
    await this.findById(id); // Check if exists

    const { categoryIds, ...restData } = data;
    const updateData: any = { ...restData };
    if (restData.published_at) updateData.published_at = new Date(restData.published_at);
    
    if (categoryIds !== undefined) {
      updateData.categories = {
        set: categoryIds.map(catId => ({ id: catId })),
      };
    }

    return this.prisma.article.update({
      where: { id },
      data: updateData,
      include: { categories: true },
    });
  }

  async publish(id: string) {
    await this.findById(id);

    return this.prisma.article.update({
      where: { id },
      data: {
        is_published: true,
        published_at: new Date(),
      },
    });
  }

  async delete(id: string) {
    await this.findById(id); // Check if exists

    return this.prisma.article.delete({
      where: { id },
    });
  }
}
