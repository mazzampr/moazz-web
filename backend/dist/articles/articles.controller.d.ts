import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
export declare class ArticlesController {
    private readonly articlesService;
    constructor(articlesService: ArticlesService);
    findAll(all?: string, category?: string): Promise<({
        categories: {
            slug: string;
            id: string;
            created_at: Date | null;
            name: string;
        }[];
    } & {
        title: string;
        slug: string;
        id: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    })[]>;
    findById(id: string): Promise<{
        categories: {
            slug: string;
            id: string;
            created_at: Date | null;
            name: string;
        }[];
    } & {
        title: string;
        slug: string;
        id: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
    findBySlug(slug: string): Promise<{
        categories: {
            slug: string;
            id: string;
            created_at: Date | null;
            name: string;
        }[];
    } & {
        title: string;
        slug: string;
        id: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
    create(createArticleDto: CreateArticleDto): Promise<{
        categories: {
            slug: string;
            id: string;
            created_at: Date | null;
            name: string;
        }[];
    } & {
        title: string;
        slug: string;
        id: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
    update(id: string, updateArticleDto: UpdateArticleDto): Promise<{
        categories: {
            slug: string;
            id: string;
            created_at: Date | null;
            name: string;
        }[];
    } & {
        title: string;
        slug: string;
        id: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
    publish(id: string): Promise<{
        title: string;
        slug: string;
        id: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
    delete(id: string): Promise<{
        title: string;
        slug: string;
        id: string;
        created_at: Date | null;
        content: string | null;
        is_published: boolean | null;
        published_at: Date | null;
    }>;
}
