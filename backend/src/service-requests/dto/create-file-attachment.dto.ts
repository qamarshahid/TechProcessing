import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { FileCategory } from '../entities/file-attachment.entity';

export class CreateFileAttachmentDto {
  @IsString()
  fileName: string;

  @IsString()
  fileUrl: string;

  @IsNumber()
  fileSize: number;

  @IsString()
  fileType: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(FileCategory)
  category?: FileCategory;
}
