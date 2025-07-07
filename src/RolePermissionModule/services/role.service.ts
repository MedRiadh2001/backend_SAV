import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/RolePermissionModule/entities/Role.entity';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from '../types/dtos/create_role.dto';
import { UpdateRoleDto } from '../types/dtos/update_role.dto';
import { Permission } from 'src/RolePermissionModule/entities/Permission.entity';
import { RolePermission } from 'src/RolePermissionModule/entities/RolePermission.entity';
import { AddPermissionsDto } from '../types/dtos/add_permission.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        @InjectRepository(Permission) private permissionRepository: Repository<Permission>,
        @InjectRepository(RolePermission) private rolePermissionRepository: Repository<RolePermission>
    ) { }

    async create(dto: CreateRoleDto) {
        // const exist = this.roleRepository.findOneBy({ name: dto.name })
        // if (exist)
        //     throw new BadRequestException("Role already exists")

        // const role = this.roleRepository.create({ name: dto.name })
        // return await this.roleRepository.save(role)

        const exists = await this.roleRepository.findOneBy({ name: dto.name });
        if (exists) throw new BadRequestException('Role name already exists');

        const role = this.roleRepository.create({ name: dto.name });
        const savedRole = await this.roleRepository.save(role);

        // const permissions = await this.permissionRepository.find({
        //     where: { id: In(dto.permissionIds) },
        // });

        // const rolePermissions = permissions.map((perm) =>
        //     this.rolePermissionRepository.create({ role: savedRole, permission: perm })
        // );

        // await this.rolePermissionRepository.save(rolePermissions);

        if (dto.permissionIds?.length) {
            const permissions = await this.permissionRepository.find({
                where: { id: In(dto.permissionIds) },
            });

            const rolePermissions = permissions.map((perm) =>
                this.rolePermissionRepository.create({ role: savedRole, permission: perm })
            );
            await this.rolePermissionRepository.save(rolePermissions);
        }

        return this.findById(savedRole.id);
    }

    async findAll() {
        return await this.roleRepository.find({ relations: ['rolePermissions', 'rolePermissions.permission'] })
    }

    async findById(id: string) {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['rolePermissions', 'rolePermissions.permission'],
        });
        if (!role) throw new NotFoundException('Role not found');
        return role;
    }

    async update(id: string, dto: UpdateRoleDto) {
        // const role = await this.roleRepository.findOneBy({ id })
        // if (!role)
        //     throw new NotFoundException("Role not found")

        // role.name = dto.name
        // return await this.roleRepository.save(role)

        const role = await this.roleRepository.findOneBy({ id });
        if (!role) throw new NotFoundException('Role not found');
        role.name = dto.name;
        await this.roleRepository.save(role);

        await this.rolePermissionRepository.delete({ role: { id } });
        const permissions = await this.permissionRepository.find({
            where: { id: In(dto.permissionIds) },
        });
        const rolePermissions = permissions.map((perm) =>
            this.rolePermissionRepository.create({ role, permission: perm })
        );
        await this.rolePermissionRepository.save(rolePermissions);

        return this.findById(id);
    }

    async addPermissions(id: string, dto: AddPermissionsDto) {
        const role = await this.roleRepository.findOne({
            where: { id },
            relations: ['rolePermissions', 'rolePermissions.permission'],
        });

        if (!role) throw new NotFoundException('Role not found');

        const existingPermissionIds = role.rolePermissions.map(rp => rp.permission.id);

        const newPermissions = await this.permissionRepository.find({
            where: { id: In(dto.permissionIds.filter(id => !existingPermissionIds.includes(id))) },
        });

        const newRolePermissions = newPermissions.map((perm) =>
            this.rolePermissionRepository.create({ role, permission: perm }),
        );

        await this.rolePermissionRepository.save(newRolePermissions);

        return this.findById(id);
    }


    async remove(id: string) {
        const role = await this.roleRepository.findOneBy({ id });
        if (!role)
            throw new NotFoundException('Role not found');

        await this.roleRepository.delete(id);
        return { deleted: true };
    }
}
