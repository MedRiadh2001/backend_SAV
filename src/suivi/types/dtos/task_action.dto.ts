import { IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TaskActionDto {
    @ApiProperty()
    @IsString()
    badgeId: string;

    @ApiProperty()
    @IsUUID()
    tacheId: string;
}