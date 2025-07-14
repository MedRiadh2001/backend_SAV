import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../RolePermissionModule/entities/Role.entity';
import { UserStatus } from '../types/enums/UserStatus.enum';

@Entity()
export class User {
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
    nom: string;

    @Column()
    @ApiProperty()
    prenom: string;

    @Column({ type: 'enum', enum: UserStatus , default: UserStatus.ACTIF})
    @ApiProperty({ enum: UserStatus })
    statut: UserStatus;

    @Column({ unique: true, nullable: true })
    @ApiProperty({ description: 'Identifiant du badge du technicien (scan)' })
    badgeId: string;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @ApiProperty({ type: () => Role })
    role: Role;
}
