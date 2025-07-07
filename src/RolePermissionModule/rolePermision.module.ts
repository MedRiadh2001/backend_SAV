import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/Role.entity';
import { Permission } from './entities/Permission.entity';
import { RolePermission } from './entities/RolePermission.entity';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Role, Permission, RolePermission]),
    ],
    controllers: [RoleController, PermissionController],
    providers: [RoleService, PermissionService],
    exports: [RoleService, PermissionService],
})
export class RolePermisionModule { }
