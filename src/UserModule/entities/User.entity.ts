import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../RolePermissionModule/entities/Role.entity';
import { UserStatus } from '../types/enums/UserStatus.enum';
import { IUser } from '../types/interfaces/IUser.interface';

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column({ nullable: true })
    @ApiProperty({ required: false })
    username?: string;

    @Column({ nullable: true })
    @ApiProperty({ required: false })
    password?: string;

    @Column()
    @ApiProperty()
    lastName: string;

    @Column()
    @ApiProperty()
    firstName: string;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    @ApiProperty({ enum: UserStatus })
    statut: UserStatus;

    @Column({ unique: true, nullable: true })
    @ApiProperty({ description: 'Identifiant du badge du technicien (scan)' })
    badgeId: string;

    @ManyToOne(() => Role, (role) => role.users, { eager: false })
    @ApiProperty({ type: () => Role })
    role: Role;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
