import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateTacheDto } from './create_tache.dto';

export class CreateOrdreReparationDto {
    @ApiProperty()
    @IsNumber()
    numOR: number;

    @ApiProperty()
    @IsString()
    vehicule: string;

    @ApiProperty()
    @IsString()
    client: string;

    @IsOptional()
    @ApiPropertyOptional({ type: [CreateTacheDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTacheDto)
    taches?: CreateTacheDto[];
}