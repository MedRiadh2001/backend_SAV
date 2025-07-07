import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/RolePermissionModule/entities/Role.entity';
import { Permission } from 'src/RolePermissionModule/entities/Permission.entity';
import { RolePermission } from 'src/RolePermissionModule/entities/RolePermission.entity';
import { User } from './entities/User.entity';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'super-secret-key',
            signOptions: { expiresIn: '1d' },
        }),
        TypeOrmModule.forFeature([Role, Permission, RolePermission, User]),
    ],
    controllers: [UserController, AuthController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
