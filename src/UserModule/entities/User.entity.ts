import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../RolePermissionModule/entities/Role.entity';

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

    @Column({ unique: true, nullable: true })
    @ApiProperty({ description: 'Identifiant du badge du technicien (scan)' })
    badgeId: string;

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    @ApiProperty({ type: () => Role })
    role: Role;
}
