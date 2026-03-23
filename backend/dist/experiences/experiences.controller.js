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
exports.ExperiencesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const experiences_service_1 = require("./experiences.service");
const experience_dto_1 = require("./dto/experience.dto");
const auth_guard_1 = require("../auth/auth.guard");
let ExperiencesController = class ExperiencesController {
    constructor(experiencesService) {
        this.experiencesService = experiencesService;
    }
    findAll() {
        return this.experiencesService.findAll();
    }
    findById(id) {
        return this.experiencesService.findById(id);
    }
    create(createExperienceDto) {
        return this.experiencesService.create(createExperienceDto);
    }
    update(id, updateExperienceDto) {
        return this.experiencesService.update(id, updateExperienceDto);
    }
    delete(id) {
        return this.experiencesService.delete(id);
    }
};
exports.ExperiencesController = ExperiencesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all experiences (sorted by order)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all experiences' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ExperiencesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get experience by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Experience details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Experience not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExperiencesController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new experience' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Experience created successfully' }),
    (0, swagger_1.ApiSecurity)('api-key'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [experience_dto_1.CreateExperienceDto]),
    __metadata("design:returntype", void 0)
], ExperiencesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an experience' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Experience updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Experience not found' }),
    (0, swagger_1.ApiSecurity)('api-key'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, experience_dto_1.UpdateExperienceDto]),
    __metadata("design:returntype", void 0)
], ExperiencesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an experience' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Experience deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Experience not found' }),
    (0, swagger_1.ApiSecurity)('api-key'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ExperiencesController.prototype, "delete", null);
exports.ExperiencesController = ExperiencesController = __decorate([
    (0, swagger_1.ApiTags)('experiences'),
    (0, common_1.Controller)('experiences'),
    __metadata("design:paramtypes", [experiences_service_1.ExperiencesService])
], ExperiencesController);
//# sourceMappingURL=experiences.controller.js.map