import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

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
}