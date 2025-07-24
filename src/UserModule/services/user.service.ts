import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/RolePermissionModule/entities/Role.entity';
import { Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import { CreateUserDto } from '../types/dto/create_user.dto';
import { UpdateUserDto } from '../types/dto/update_user.dto';
import * as bcrypt from 'bcryptjs';
import { UserStatus } from '../types/enums/UserStatus.enum';
import { ChangePasswordDto } from '../types/dto/change_password.dto';

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
            lastName: dto.lastName,
            firstName: dto.firstName,
            role,
            badgeId: dto.badgeId,
        });
        return this.userRepo.save(user);
    }

    async findAllToExport(page = 1, items = 10) {

        const [result, total] = await this.userRepo.findAndCount({
            relations: ['role', 'role.rolePermissions.permission'],
            skip: (page - 1) * items,
            take: items,
        });

        const lastPage = Math.ceil(total / items);
        const nextPage = page < lastPage ? page + 1 : null;

        return {
            result,
            total,
            page,
            lastPage,
            nextPage,
        };
    }

    async findAll(page = 1, items = 10, roleId?: string, keyword?: string) {
        const query = this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
            .leftJoinAndSelect('rolePermissions.permission', 'permission');

        if (roleId) {
            query.andWhere('role.id = :roleId', { roleId });
        }

        if (keyword) {
            query.andWhere(
                `(user.lastName ILIKE :kw OR user.firstName ILIKE :kw OR user.username ILIKE :kw OR role.name ILIKE :kw)`,
                { kw: `%${keyword}%` }
            );
        }

        const [result, total] = await query
            .skip((page - 1) * items)
            .take(items)
            .getManyAndCount();

        const lastPage = Math.ceil(total / items);
        const nextPage = page < lastPage ? page + 1 : null;

        return {
            result,
            total,
            page,
            lastPage,
            nextPage,
        };
    }


    async findOne(id: string) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: ['role', 'role.rolePermissions.permission'],
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) throw new NotFoundException('User not found');
        const role = await this.roleRepo.findOneBy({ id: dto.roleId });
        const {lastName, firstName, statut, roleId} = dto
        if (lastName) {user.lastName = dto.lastName;}
        if (firstName) {user.firstName = dto.firstName}
        if (statut) {user.statut = dto.statut}
        if (roleId){user.role = role};
        return this.userRepo.save(user);
    }

    async remove(id: string) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) throw new NotFoundException('Utilisateur non trouvé');

        user.statut = UserStatus.INACTIV;
        return this.userRepo.save(user);
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        if (dto.newPassword !== dto.confirmPassword) {
            throw new BadRequestException("Les mots de passe ne correspondent pas");
        }

        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new BadRequestException("Utilisateur non trouvé");

        const hashed = await bcrypt.hash(dto.newPassword, 10);
        user.password = hashed;

        await this.userRepo.save(user);
        return { message: 'Mot de passe mis à jour avec succès' };
    }


    async findByUsername(username: string) {
        return this.userRepo.findOne({ where: { username }, relations: ['role', 'role.rolePermissions.permission'] });
    }

    async validateUser(username: string, password: string): Promise<User> {
        const user = await this.findByUsername(username);
        if (!user || !user.password) throw new UnauthorizedException();

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new UnauthorizedException();

        return user;
    }
}

