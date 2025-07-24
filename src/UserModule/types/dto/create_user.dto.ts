import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateUserDto {
    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiProperty({description: "nom de l'utilisateur"})
    @IsString()
    lastName:string;

    @ApiProperty({description: "prenom de l'utilisateur"})
    @IsString()
    firstName:string;

    @ApiProperty({ description: 'UUID du rôle' })
    @IsUUID()
    roleId: string;

    @ApiPropertyOptional({ description: 'ID badge unique du technicien' })
    @IsOptional()
    @IsString()
    badgeId?: string;
}