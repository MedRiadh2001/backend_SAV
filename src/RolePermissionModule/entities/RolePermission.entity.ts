import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './Role.entity';
import { Permission } from './Permission.entity';

@Entity()
export class RolePermission {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roleId' })
    @ApiProperty({ type: () => Role })
    role: Role;

    @ManyToOne(() => Permission, (perm) => perm.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permissionId' })
    @ApiProperty({ type: () => Permission })
    permission: Permission;
}