import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RolePermission } from './RolePermission.entity';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column({ unique: true })
    @ApiProperty()
    name: string;

    @ManyToOne(() => Permission, (perm) => perm.secondaryPermission, { nullable: true })
    @ApiProperty({ type: () => Permission, required: false })
    mainPermission: Permission;

    @OneToMany(() => Permission, (perm) => perm.mainPermission)
    secondaryPermission: Permission[];

    @OneToMany(() => RolePermission, (rp) => rp.permission)
    rolePermissions: RolePermission[];
}