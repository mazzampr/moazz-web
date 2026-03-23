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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.project.findMany({
            orderBy: { created_at: 'desc' },
        });
    }
    async findBySlug(slug) {
        const project = await this.prisma.project.findUnique({
            where: { slug },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with slug "${slug}" not found`);
        }
        return project;
    }
    async findById(id) {
        const project = await this.prisma.project.findUnique({
            where: { id },
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID "${id}" not found`);
        }
        return project;
    }
    async create(data) {
        const { project_date, ...rest } = data;
        return this.prisma.project.create({
            data: {
                ...rest,
                project_date: project_date ? new Date(project_date) : undefined,
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const { project_date, ...rest } = data;
        return this.prisma.project.update({
            where: { id },
            data: {
                ...rest,
                project_date: project_date ? new Date(project_date) : undefined,
            },
        });
    }
    async delete(id) {
        await this.findById(id);
        return this.prisma.project.delete({
            where: { id },
        });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map