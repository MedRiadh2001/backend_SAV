import {
    BadRequestException,
    HttpException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/RolePermissionModule/entities/Permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from '../types/dtos/create_permission.dto';
import { UpdatePermissionDto } from '../types/dtos/update_permission.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private permissionRepository: Repository<Permission>,
    ) { }

    async create(dto: CreatePermissionDto) {
        try {
            if (!dto.mainPermissionId) {
                const existing = await this.permissionRepository.findOneBy({
                    name: dto.name,
                });
                if (existing) {
                    throw new BadRequestException(
                        'Permission with this name already exists',
                    );
                }
            }

            const permission = new Permission();
            permission.name = dto.name;

            if (dto.mainPermissionId) {
                const main = await this.permissionRepository.findOne({
                    where: { id: dto.mainPermissionId },
                    relations: ['mainPermission'],
                });
                if (!main) {
                    throw new NotFoundException('Main permission not found');
                }
                if (main.mainPermission !== null) {
                    throw new BadRequestException(
                        'A secondary permission cannot be a main permission',
                    );
                }
                permission.mainPermission = main;
            }

            return await this.permissionRepository.save(permission);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async findAll() {
        try {
            return await this.permissionRepository.find({
                relations: ['mainPermission'],
            });
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async findMainPermissions() {
        const allPermissions = await this.permissionRepository.find({
            relations: ['mainPermission', 'secondaryPermission'],
        });

        const mainPermissions = allPermissions.filter(perm => perm.mainPermission === null);

        return mainPermissions.map((main) => ({
            id: main.id,
            name: main.name,
            secondaryPermissions: main.secondaryPermission.map((secondaryPermission) => ({
                id: secondaryPermission.id,
                name: secondaryPermission.name,
            })),
        }));
    }

    async findById(id: string) {
        try {
            const permission = await this.permissionRepository.findOne({
                where: { id },
                relations: ['secondaryPermission'],
            });
            if (!permission) throw new NotFoundException('Permission not found');
            return permission;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async update(id: string, dto: UpdatePermissionDto) {
        try {
            const permission = await this.permissionRepository.findOneBy({ id });
            if (!permission) throw new NotFoundException('Permission not found');

            permission.name = dto.name ?? permission.name;

            if (dto.mainPermissionId !== null) {
                permission.mainPermission = dto.mainPermissionId
                    ? await this.permissionRepository.findOneBy({
                        id: dto.mainPermissionId,
                    })
                    : null;

                const main = await this.permissionRepository.findOneBy({ id: dto.mainPermissionId, })
                if (main.mainPermission !== null) {
                    throw new BadRequestException(
                        'A secondary permission cannot be a main permission',
                    );
                }
                if (dto.mainPermissionId && !permission.mainPermission) {
                    throw new NotFoundException('Main permission not found');
                }
            }

            return await this.permissionRepository.save(permission);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async remove(id: string) {
        try {
            const exists = await this.permissionRepository.findOneBy({ id });
            if (!exists) throw new NotFoundException('Permission not found');
            await this.permissionRepository.delete(id);
            return { deleted: true };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
