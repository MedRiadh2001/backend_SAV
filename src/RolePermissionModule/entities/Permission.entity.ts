import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { RolePermission } from './RolePermission.entity';
import { IPermission } from '../types/interfaces/IPermission.interface';

@Entity()
export class Permission implements IPermission {
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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}