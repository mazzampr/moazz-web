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
exports.ExperiencesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExperiencesService = class ExperiencesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.experience.findMany({
            orderBy: { order: 'asc' },
        });
    }
    async findById(id) {
        const experience = await this.prisma.experience.findUnique({
            where: { id },
        });
        if (!experience) {
            throw new common_1.NotFoundException(`Experience with ID "${id}" not found`);
        }
        return experience;
    }
    async create(data) {
        return this.prisma.experience.create({
            data: {
                ...data,
                start_date: new Date(data.start_date),
                end_date: data.end_date ? new Date(data.end_date) : null,
            },
        });
    }
    async update(id, data) {
        await this.findById(id);
        const updateData = { ...data };
        if (data.start_date)
            updateData.start_date = new Date(data.start_date);
        if (data.end_date)
            updateData.end_date = new Date(data.end_date);
        return this.prisma.experience.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        await this.findById(id);
        return this.prisma.experience.delete({
            where: { id },
        });
    }
};
exports.ExperiencesService = ExperiencesService;
exports.ExperiencesService = ExperiencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExperiencesService);
//# sourceMappingURL=experiences.service.js.map