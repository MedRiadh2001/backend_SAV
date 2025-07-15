import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Nom unique de la permission' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'ID de la permission principale (si secondaire)', required: false })
  @IsOptional()
  @IsUUID()
  mainPermissionId?: string;
}
