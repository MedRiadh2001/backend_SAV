import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class PauseTaskDto {
    @ApiProperty()
    @IsString()
    badgeId: string;

    @ApiProperty()
    @IsUUID()
    tacheId: string;
}