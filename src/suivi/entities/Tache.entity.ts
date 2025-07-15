import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OrdreReparation } from "./OrdreReparation.entity";
import { StatutTache } from "../types/enums/statutTache.enum";
import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";

@Entity()
export class Tache implements IIdentifiable{
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column()
    @ApiProperty()
    titre: string;

    @Column({ nullable: true })
    @ApiProperty({ required: false })
    details: string;

    @Column({ type: 'enum', enum: StatutTache })
    @ApiProperty({ enum: StatutTache })
    statut: StatutTache;

    @ManyToOne(() => OrdreReparation, (or) => or.taches, { onDelete: 'CASCADE' })
    @ApiProperty({ type: () => OrdreReparation })
    ordreReparation: OrdreReparation;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}