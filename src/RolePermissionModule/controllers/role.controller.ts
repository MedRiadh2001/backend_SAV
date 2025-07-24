import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from '../types/dtos/create_role.dto';
import { UpdateRoleDto } from '../types/dtos/update_role.dto';
import { AddPermissionsDto } from '../types/dtos/add_permission.dto';

@ApiTags('Roles')
@Controller('backoffice/role')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Post()
    @ApiOperation({ summary: 'Créer un rôle avec des permissions' })
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister les rôles' })
    findAll() {
        return this.roleService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Afficher un rôle par ID' })
    findOne(@Param('id') id: string) {
        return this.roleService.findById(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour le nom d’un rôle et ses permissions' })
    update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
        return this.roleService.update(id, dto);
    }

    @Patch(':id/add-permissions')
    @ApiOperation({ summary: 'Ajouter des permissions à un rôle existant' })
    addPermissions(@Param('id') id: string, @Body() dto: AddPermissionsDto) {
        return this.roleService.addPermissions(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un rôle' })
    remove(@Param('id') id: string) {
        return this.roleService.remove(id);
    }
}
