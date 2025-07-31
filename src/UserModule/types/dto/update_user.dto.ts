import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { UserStatus } from "../enums/UserStatus.enum";

export class UpdateUserDto {
    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsEnum(UserStatus)
    statut?: UserStatus;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsUUID()
    roleId?: string;

    @ApiPropertyOptional({ description: 'Déterminer si l\'utilisateur est un technicien ou non' })
    @IsOptional()
    @IsBoolean()
    isTechnician: boolean;
}