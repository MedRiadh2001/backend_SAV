import { Controller, Post, Get, Param, Patch, Delete, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../types/dto/create_user.dto';
import { UpdateUserDto } from '../types/dto/update_user.dto';

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
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Touver un utilisateur par ID' })
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Get(':username')
    @ApiOperation({ summary: 'Touver un utilisateur par Username' })
    findOneByUsername(@Param('username') username: string) {
        return this.userService.findByUsername(username);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un utilisateur' })
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
