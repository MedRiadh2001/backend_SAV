import { IsEnum, IsOptional, IsString } from "class-validator";
import { HistoriqueType  } from "../enums/TypePointage.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ScanBadgeDto {
    @ApiProperty()
    @IsString()
    badgeId: string;

    @ApiPropertyOptional({enum: HistoriqueType })
    @IsOptional()
    @IsEnum(HistoriqueType )
    type?: HistoriqueType ;
}