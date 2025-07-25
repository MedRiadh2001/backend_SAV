import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../UserModule/entities/User.entity';
import { RolePermission } from './RolePermission.entity';
import { IRole } from '../types/interfaces/IRole.interface';

@Entity()
export class Role implements IRole{
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column({ unique: true })
    @ApiProperty()
    name: string;

    @OneToMany(() => RolePermission, (rp) => rp.role, { eager: false })
    @ApiProperty({ type: () => RolePermission, isArray: true })
    rolePermissions: RolePermission[];

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;   
}
