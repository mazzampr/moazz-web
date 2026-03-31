export declare class CreateArticleDto {
    title: string;
    slug: string;
    content: string;
    is_published?: boolean;
    published_at?: string;
    categoryIds?: string[];
}
export declare class UpdateArticleDto {
    title?: string;
    slug?: string;
    content?: string;
    is_published?: boolean;
    published_at?: string;
    categoryIds?: string[];
}
