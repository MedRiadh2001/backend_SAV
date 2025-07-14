import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/RolePermissionModule/entities/Role.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { CreateUserDto } from '../types/dto/create_user.dto';
import { UpdateUserDto } from '../types/dto/update_user.dto';
import * as bcrypt from 'bcryptjs';
import { UserStatus } from '../types/enums/UserStatus.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Role) private roleRepo: Repository<Role>,
    ) { }

    async create(dto: CreateUserDto) {
        const role = await this.roleRepo.findOneBy({ id: dto.roleId });
        if (!role) throw new NotFoundException('Role not found');

        const user = this.userRepo.create({
            username: dto.username,
            password: dto.password ? await bcrypt.hash(dto.password, 10) : undefined,
            nom: dto.nom,
            prenom: dto.prenom,
            role,
            badgeId: dto.badgeId,
        });
        return this.userRepo.save(user);
    }

    async findAll(page = 1, limit = 10) {
        const [data, total] = await this.userRepo.findAndCount({
            where: { statut: UserStatus.ACTIF },
            relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    async findOne(id: string) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) throw new NotFoundException('User not found');
        const role = await this.roleRepo.findOneBy({ id: dto.roleId });
        user.username = dto.username;
        user.role = role;
        return this.userRepo.save(user);
    }

    async remove(id: string) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) throw new NotFoundException('Utilisateur non trouvé');

        user.statut = UserStatus.INACTIF;
        return this.userRepo.save(user);
    }

    async findByUsername(username: string) {
        return this.userRepo.findOne({ where: { username }, relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'] });
    }

    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.findByUsername(username);
        if (!user || !user.password) throw new UnauthorizedException();

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException();

        return user;
    }
}

