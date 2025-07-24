import { IsEnum, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TaskAction } from "../enums/task_action.enum";

export class TaskActionDto {
    @ApiProperty()
    @IsString()
    badgeId: string;

    @ApiProperty()
    @IsUUID()
    tacheId: string;

    @ApiProperty()
    @IsEnum(TaskAction)
    action: TaskAction
}