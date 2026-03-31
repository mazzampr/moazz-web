import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Body,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiSecurity, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const url = await this.uploadService.uploadImage(file);
    return { url };
  }

  @Post('image/delete')
  @ApiSecurity('api-key')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete an image' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
        },
      },
    },
  })
  async deleteImage(@Req() req: any, @Body('url') url: string) {
    if (!url) {
      throw new BadRequestException('No URL provided');
    }

    await this.uploadService.deleteImage(url);
    return { success: true };
  }
}
