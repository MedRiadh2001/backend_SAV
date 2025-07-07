import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PermissionService } from '../services/permission.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePermissionDto } from '../types/dtos/create_permission.dto';
import { UpdatePermissionDto } from '../types/dtos/update_permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle permission' })
  create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les permissions' })
  findAll() {
    return this.permissionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une permission par ID' })
  findOne(@Param('id') id: string) {
    return this.permissionService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une permission' })
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.permissionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une permission' })
  remove(@Param('id') id: string) {
    return this.permissionService.remove(id);
  }
}
