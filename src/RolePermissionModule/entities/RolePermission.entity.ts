import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './Role.entity';
import { Permission } from './Permission.entity';
import { IIdentifiable } from 'src/shared/interfaces/IIdentifiable.interface';

@Entity()
export class RolePermission implements IIdentifiable {
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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}