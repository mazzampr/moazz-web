"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ArticlesService = class ArticlesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(publishedOnly = true, categorySlug) {
        const where = {};
        if (publishedOnly) {
            where.is_published = true;
        }
        if (categorySlug) {
            where.categories = {
                some: { slug: categorySlug }
            };
        }
        return this.prisma.article.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: {
                categories: true,
            },
        });
    }
    async findBySlug(slug) {
        const article = await this.prisma.article.findUnique({
            where: { slug },
            include: { categories: true },
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article with slug "${slug}" not found`);
        }
        return article;
    }
    async findById(id) {
        const article = await this.prisma.article.findUnique({
            where: { id },
            include: { categories: true },
        });
        if (!article) {
            throw new common_1.NotFoundException(`Article with ID "${id}" not found`);
        }
        return article;
    }
    async create(data) {
        const { categoryIds, ...restData } = data;
        return this.prisma.article.create({
            data: {
                ...restData,
                published_at: restData.published_at ? new Date(restData.published_at) : null,
                categories: {
                    connect: categoryIds?.map(id => ({ id })) || [],
                }
            },
            include: { categories: true },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const { categoryIds, ...restData } = data;
        const updateData = { ...restData };
        if (restData.published_at)
            updateData.published_at = new Date(restData.published_at);
        if (categoryIds !== undefined) {
            updateData.categories = {
                set: categoryIds.map(catId => ({ id: catId })),
            };
        }
        return this.prisma.article.update({
            where: { id },
            data: updateData,
            include: { categories: true },
        });
    }
    async publish(id) {
        await this.findById(id);
        return this.prisma.article.update({
            where: { id },
            data: {
                is_published: true,
                published_at: new Date(),
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        return this.prisma.article.delete({
            where: { id },
        });
    }
};
exports.ArticlesService = ArticlesService;
exports.ArticlesService = ArticlesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map