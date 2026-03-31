import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published articles' })
  @ApiResponse({ status: 200, description: 'List of published articles' })
  @ApiQuery({
    name: 'all',
    required: false,
    type: Boolean,
    description: 'Include unpublished articles (admin only)',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category slug',
  })
  findAll(
    @Query('all') all?: string,
    @Query('category') category?: string
  ) {
    const publishedOnly = all !== 'true';
    return this.articlesService.findAll(publishedOnly, category);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiResponse({ status: 200, description: 'Article details' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findById(@Param('id') id: string) {
    return this.articlesService.findById(id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get article by slug' })
  @ApiResponse({ status: 200, description: 'Article details' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findBySlug(@Param('slug') slug: string) {
    return this.articlesService.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create a draft article' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard)
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an article' })
  @ApiResponse({ status: 200, description: 'Article updated successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Patch(':id/publish')
  @ApiOperation({ summary: 'Publish an article' })
  @ApiResponse({ status: 200, description: 'Article published successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard)
  publish(@Param('id') id: string) {
    return this.articlesService.publish(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an article' })
  @ApiResponse({ status: 200, description: 'Article deleted successfully' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: string) {
    return this.articlesService.delete(id);
  }
}
