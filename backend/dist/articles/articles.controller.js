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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const articles_service_1 = require("./articles.service");
const article_dto_1 = require("./dto/article.dto");
const auth_guard_1 = require("../auth/auth.guard");
let ArticlesController = class ArticlesController {
    constructor(articlesService) {
        this.articlesService = articlesService;
    }
    findAll(all, category) {
        const publishedOnly = all !== 'true';
        return this.articlesService.findAll(publishedOnly, category);
    }
    findById(id) {
        return this.articlesService.findById(id);
    }
    findBySlug(slug) {
        return this.articlesService.findBySlug(slug);
    }
    create(createArticleDto) {
        return this.articlesService.create(createArticleDto);
    }
    update(id, updateArticleDto) {
        return this.articlesService.update(id, updateArticleDto);
    }
    publish(id) {
        return this.articlesService.publish(id);
    }
    delete(id) {
        return this.articlesService.delete(id);
    }
};
exports.ArticlesController = ArticlesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all published articles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of published articles' }),
    (0, swagger_1.ApiQuery)({
        name: 'all',
        required: false,
        type: Boolean,
        description: 'Include unpublished articles (admin only)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'category',
        required: false,
        type: String,
        description: 'Filter by category slug',
    }),
    __param(0, (0, common_1.Query)('all')),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('id/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get article by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get article by slug' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a draft article' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Article created successfully' }),
    (0, swagger_1.ApiSecurity)('api-key'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an article' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    (0, swagger_1.ApiSecurity)('api-key'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, article_dto_1.UpdateArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, swagger_1.ApiOperation)({ summary: 'Publish an article' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article published successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    (0, swagger_1.ApiSecurity)('api-key'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "publish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an article' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Article deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Article not found' }),
    (0, swagger_1.ApiSecurity)('api-key'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "delete", null);
exports.ArticlesController = ArticlesController = __decorate([
    (0, swagger_1.ApiTags)('articles'),
    (0, common_1.Controller)('articles'),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService])
], ArticlesController);
//# sourceMappingURL=articles.controller.js.map