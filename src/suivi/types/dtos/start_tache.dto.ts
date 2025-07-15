import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class StartTaskDto {
    @ApiProperty()
    @IsString()
    badgeId: string;

    @ApiProperty()
    @IsUUID()
    tacheId: string;
}