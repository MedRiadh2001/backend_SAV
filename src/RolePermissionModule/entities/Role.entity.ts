import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../UserModule/entities/User.entity';
import { RolePermission } from './RolePermission.entity';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column({ unique: true })
    @ApiProperty()
    name: string;

    @OneToMany(() => RolePermission, (rp) => rp.role, { eager: true })
    @ApiProperty({ type: () => RolePermission, isArray: true })
    rolePermissions: RolePermission[];

    @OneToMany(() => User, (user) => user.role)
    users: User[];
}
