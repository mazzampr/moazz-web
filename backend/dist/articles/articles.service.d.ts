import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
export declare class ArticlesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(publishedOnly?: boolean): Promise<{
        id: string;
        title: string;
        slug: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }[]>;
    findBySlug(slug: string): Promise<{
        id: string;
        title: string;
        slug: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
    findById(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
    create(data: CreateArticleDto): Promise<{
        id: string;
        title: string;
        slug: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
    update(id: string, data: UpdateArticleDto): Promise<{
        id: string;
        title: string;
        slug: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
    publish(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
}
