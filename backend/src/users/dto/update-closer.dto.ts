import { PartialType } from '@nestjs/mapped-types';
import { CreateCloserDto } from './create-closer.dto';

export class UpdateCloserDto extends PartialType(CreateCloserDto) {}
