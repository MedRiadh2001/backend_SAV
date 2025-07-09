import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/user.service';
import { LoginUserDto } from '../types/dto/login_user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    @Post('login')
    @ApiOperation({ summary: 'Se connecter' })
    async login(@Body() dto: LoginUserDto) {
        const user = await this.userService.validateUser(dto.username, dto.password);
        const payload = { sub: user.id, username: user.username };
        const access_token = await this.jwtService.signAsync(payload);
        return { access_token };
    }
}