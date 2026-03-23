import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('experiences')
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all experiences (sorted by order)' })
  @ApiResponse({ status: 200, description: 'List of all experiences' })
  findAll() {
    return this.experiencesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get experience by ID' })
  @ApiResponse({ status: 200, description: 'Experience details' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  findById(@Param('id') id: string) {
    return this.experiencesService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new experience' })
  @ApiResponse({ status: 201, description: 'Experience created successfully' })
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard)
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experiencesService.create(createExperienceDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an experience' })
  @ApiResponse({ status: 200, description: 'Experience updated successfully' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an experience' })
  @ApiResponse({ status: 204, description: 'Experience deleted successfully' })
  @ApiResponse({ status: 404, description: 'Experience not found' })
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string) {
    return this.experiencesService.delete(id);
  }
}
