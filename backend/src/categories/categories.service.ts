import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { articles: true },
        },
      }
    });
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.prisma.category.findUnique({
      where: { slug: createCategoryDto.slug },
    });
    if (existing) throw new ConflictException('Category with this slug already exists');

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findById(id); // Ensure it exists

    if (updateCategoryDto.slug) {
      const existing = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async delete(id: string) {
    await this.findById(id); // Ensure it exists
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
