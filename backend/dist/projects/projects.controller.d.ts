import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    findAll(): Promise<{
        description: string;
        title: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        id: string;
        created_at: Date | null;
    }[]>;
    findById(id: string): Promise<{
        description: string;
        title: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        id: string;
        created_at: Date | null;
    }>;
    findBySlug(slug: string): Promise<{
        description: string;
        title: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        id: string;
        created_at: Date | null;
    }>;
    create(createProjectDto: CreateProjectDto): Promise<{
        description: string;
        title: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        id: string;
        created_at: Date | null;
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto): Promise<{
        description: string;
        title: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        id: string;
        created_at: Date | null;
    }>;
    delete(id: string): Promise<{
        description: string;
        title: string;
        slug: string;
        thumbnail_url: string | null;
        tech_stack: import("@prisma/client/runtime/library").JsonValue | null;
        demo_url: string | null;
        repo_url: string | null;
        is_featured: boolean | null;
        project_date: Date | null;
        id: string;
        created_at: Date | null;
    }>;
}
