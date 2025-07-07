import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Nom unique de la permission' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'ID de la permission principale (si secondaire)', required: false })
  @IsOptional()
  @IsNumber()
  mainPermissionId?: string;
}