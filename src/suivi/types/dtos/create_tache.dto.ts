import { IsString, IsOptional, IsUUID, IsEnum } from "class-validator";
import { StatutTache } from "../enums/statutTache.enum";
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
    @IsEnum(StatutTache)
    statut?: StatutTache;

    @ApiProperty()
    @IsUUID()
    ordreReparationId: string;
}
