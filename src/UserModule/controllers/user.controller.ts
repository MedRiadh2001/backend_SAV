import { Controller, Post, Get, Param, Patch, Delete, Body, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../types/dto/create_user.dto';
import { UpdateUserDto } from '../types/dto/update_user.dto';
import { ChangePasswordDto } from '../types/dto/change_password.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @ApiOperation({ summary: 'Créer un nouveau utilisateur' })
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister tous les utilisateurs' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'roleId', required: false })
    findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('roleId', new ParseUUIDPipe({ optional: true })) roleId?:string) {
        return this.userService.findAll(page, limit, roleId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Touver un utilisateur par ID' })
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
    update(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Patch(':id/masquer')
    @ApiOperation({ summary: 'Masquer un utilisateur' })
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.userService.remove(id);
    }

    @Patch(':id/change-password')
    @ApiOperation({ summary: 'Changer le mot de passe utilisateur' })
    changePassword(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: ChangePasswordDto) {
        return this.userService.changePassword(id, dto);
    }
}
