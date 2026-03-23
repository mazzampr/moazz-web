import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
    });

    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }

    return project;
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    return project;
  }

  async create(data: CreateProjectDto) {
    const { project_date, ...rest } = data;
    return this.prisma.project.create({
      data: {
        ...rest,
        project_date: project_date ? new Date(project_date) : undefined,
      },
    });
  }

  async update(id: string, data: UpdateProjectDto) {
    await this.findById(id); // Check if exists

    const { project_date, ...rest } = data;
    return this.prisma.project.update({
      where: { id },
      data: {
        ...rest,
        project_date: project_date ? new Date(project_date) : undefined,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id); // Check if exists

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
