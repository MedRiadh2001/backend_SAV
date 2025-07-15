import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
    @ApiProperty({ description: 'Nom du rôle' })
    @IsString()
    name: string;

    @IsOptional()
    @ApiPropertyOptional({ description: 'Liste des permissions associées (UUID)', type: [String] })
    @IsArray()
    @IsUUID('all', { each: true })
    permissionIds?: string[];
}