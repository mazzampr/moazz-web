import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  MaxLength,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Frontend Developer', description: 'Job position' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  position: string;

  @ApiProperty({ example: 'Tech Company Inc.', description: 'Company name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  company: string;

  @ApiProperty({ example: '2022-01-01', description: 'Start date' })
  @IsDateString()
  start_date: string;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'End date (null for current position)',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({
    example: '- Built responsive web applications\n- Led team of 3 developers',
    description: 'Job description with achievements',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Display order (lower = higher priority)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateExperienceDto {
  @ApiPropertyOptional({ example: 'Senior Frontend Developer' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  position?: string;

  @ApiPropertyOptional({ example: 'New Company Ltd.' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  company?: string;

  @ApiPropertyOptional({ example: '2022-06-01' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ example: '2024-12-01' })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
