import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async findAll(publishedOnly: boolean = true) {
    const where = publishedOnly ? { is_published: true } : {};

    return this.prisma.article.findMany({
      where,
      orderBy: { published_at: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { slug },
    });

    if (!article) {
      throw new NotFoundException(`Article with slug "${slug}" not found`);
    }

    return article;
  }

  async findById(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID "${id}" not found`);
    }

    return article;
  }

  async create(data: CreateArticleDto) {
    return this.prisma.article.create({
      data: {
        ...data,
        published_at: data.published_at ? new Date(data.published_at) : null,
      },
    });
  }

  async update(id: string, data: UpdateArticleDto) {
    await this.findById(id); // Check if exists

    const updateData: any = { ...data };
    if (data.published_at) updateData.published_at = new Date(data.published_at);

    return this.prisma.article.update({
      where: { id },
      data: updateData,
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
