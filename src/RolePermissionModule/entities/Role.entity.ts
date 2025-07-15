import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../UserModule/entities/User.entity';
import { RolePermission } from './RolePermission.entity';
import { IIdentifiable } from 'src/shared/interfaces/IIdentifiable.interface';

@Entity()
export class Role implements IIdentifiable{
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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;   
}
