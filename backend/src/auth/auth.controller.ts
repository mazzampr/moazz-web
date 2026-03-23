import { Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Post('verify')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify admin API key' })
  @ApiResponse({ status: 200, description: 'API key is valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiSecurity('api-key')
  verify() {
    return { success: true, message: 'API key is valid' };
  }
}
