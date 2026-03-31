import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Machine Learning', description: 'The name of the category' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'machine-learning', description: 'The slug for the category URL' })
  @IsString()
  @IsNotEmpty()
  slug: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Machine Learning', description: 'The name of the category' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'machine-learning', description: 'The slug for the category URL' })
  @IsString()
  @IsOptional()
  slug?: string;
}