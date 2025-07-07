import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create_permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}