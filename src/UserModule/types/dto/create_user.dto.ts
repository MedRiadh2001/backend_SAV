import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    username?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    password?: string;

    @ApiProperty({description: "nom de l'utilisateur"})
    @IsString()
    nom:string;

    @ApiProperty({description: "prenom de l'utilisateur"})
    @IsString()
    prenom:string;

    @ApiProperty({ description: 'UUID du rôle' })
    @IsUUID()
    roleId: string;

    @ApiProperty({ description: 'ID badge unique du technicien' })
    @IsOptional()
    @IsString()
    badgeId?: string;
}