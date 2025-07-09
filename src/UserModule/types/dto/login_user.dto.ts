import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class LoginUserDto {
    @ApiProperty({ required: false })
    @IsString()
    username: string;

    @ApiProperty({ required: false })
    @IsString()
    password: string;
}