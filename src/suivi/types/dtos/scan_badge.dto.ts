import { IsEnum, IsOptional, IsString } from "class-validator";
import { PointageType } from "../enums/TypePointage.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ScanBadgeDto {
    @ApiProperty()
    @IsString()
    badgeId: string;

    @ApiPropertyOptional({enum: PointageType})
    @IsOptional()
    @IsEnum(PointageType)
    type?: PointageType;
}