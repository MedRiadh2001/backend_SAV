import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create_role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}