import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID "${id}" not found`);
    }

    return experience;
  }

  async create(data: CreateExperienceDto) {
    return this.prisma.experience.create({
      data: {
        ...data,
        start_date: new Date(data.start_date),
        end_date: data.end_date ? new Date(data.end_date) : null,
      },
    });
  }

  async update(id: string, data: UpdateExperienceDto) {
    await this.findById(id); // Check if exists

    const updateData: any = { ...data };
    if (data.start_date) updateData.start_date = new Date(data.start_date);
    if (data.end_date) updateData.end_date = new Date(data.end_date);

    return this.prisma.experience.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    await this.findById(id); // Check if exists

    return this.prisma.experience.delete({
      where: { id },
    });
  }
}
