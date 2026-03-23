import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    findAll(all?: string): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
        created_at: Date | null;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
        created_at: Date | null;
    }>;
    findBySlug(slug: string): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
        created_at: Date | null;
    }>;
    create(createArticleDto: CreateArticleDto): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
        created_at: Date | null;
    }>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
        created_at: Date | null;
    }>;
    publish(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
        created_at: Date | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        title: string;
        slug: string;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
        created_at: Date | null;
    }>;
}
