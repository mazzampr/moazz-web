export declare class CreateProjectDto {
    title: string;
    description: string;
    slug: string;
    thumbnail_url?: string;
    tech_stack: string[];
    demo_url?: string;
    repo_url?: string;
    is_featured?: boolean;
    project_date?: string;
}
export declare class UpdateProjectDto {
    title?: string;
    description?: string;
    slug?: string;
    thumbnail_url?: string;
    tech_stack?: string[];
    demo_url?: string;
    repo_url?: string;
    is_featured?: boolean;
    project_date?: string;
}
