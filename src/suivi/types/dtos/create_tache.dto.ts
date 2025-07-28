import { IsString, IsOptional, IsUUID, IsEnum } from "class-validator";
import { TaskStatus } from "../enums/statutTache.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTacheDto {
    @ApiProperty()
    @IsString()
    titre: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    details?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEnum(TaskStatus)
    statut?: TaskStatus;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    ordreReparationId?: string;
}
