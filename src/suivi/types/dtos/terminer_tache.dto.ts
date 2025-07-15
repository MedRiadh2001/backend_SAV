import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class EndTaskDto {
    @ApiProperty()
    @IsString()
    badgeId: string;

    @ApiProperty()
    @IsUUID()
    tacheId: string;
}