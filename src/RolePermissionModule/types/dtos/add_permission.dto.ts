import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class AddPermissionsDto {
  @ApiProperty({ description: 'Liste des permissions à ajouter (UUID)', type: [String] })
  @IsArray()
  @IsUUID('all', { each: true })
  permissionIds: string[];
}