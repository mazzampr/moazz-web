import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
export declare class ProjectsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        title: string;
        description: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        created_at: Date | null;
    }[]>;
    findBySlug(slug: string): Promise<{
        id: string;
        title: string;
        description: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        created_at: Date | null;
    }>;
    findById(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        created_at: Date | null;
    }>;
    create(data: CreateProjectDto): Promise<{
        id: string;
        title: string;
        description: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        created_at: Date | null;
    }>;
    update(id: string, data: UpdateProjectDto): Promise<{
        id: string;
        title: string;
        description: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        created_at: Date | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        created_at: Date | null;
    }>;
}
