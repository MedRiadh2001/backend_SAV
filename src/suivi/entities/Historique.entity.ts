import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/UserModule/entities/User.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PointageType } from "../types/enums/TypePointage.enum";
import { Tache } from "./Tache.entity";
import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";

@Entity()
export class Historique implements IIdentifiable{
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
    @ApiProperty({ type: () => User })
    technicien: User;

    @ManyToOne(() => Tache, { nullable: true, eager: false, onDelete: 'SET NULL' })
    @ApiProperty({ type: () => Tache, required: false })
    tache?: Tache;

    @Column({ type: 'enum', enum: PointageType })
    @ApiProperty({ enum: PointageType })
    type: PointageType;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty()
    heure: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;   
}