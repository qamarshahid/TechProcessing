import { IsString, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateServicePackageDto {
  @ApiProperty({ example: 'Starter Website Package' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Perfect for small businesses and personal websites' })
  @IsString()
  description: string;

  @ApiProperty({ example: 799.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ 
    example: ['Responsive Design', 'Up to 5 Pages', 'Contact Form', 'Basic SEO', '1 Month Support'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  features: string[];
}