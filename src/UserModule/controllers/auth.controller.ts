import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../services/user.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: 'Se connecter' })
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.userService.validateUser(body.username, body.password);
    const payload = { sub: user.id, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}