import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateUserDto {
    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsString()
    username: string;

    @ApiPropertyOptional({ required: false })
    @IsOptional()
    @IsUUID()
    roleId: string;
}