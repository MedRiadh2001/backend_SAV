import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { OrdreReparation } from "./OrdreReparation.entity";
import { TaskStatus } from "../types/enums/statutTache.enum";
import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";
import { Historique } from "./Historique.entity";

@Entity()
export class Tache implements IIdentifiable {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column()
    @ApiProperty()
    titre: string;

    @Column({ nullable: true })
    @ApiProperty({ required: false })
    details: string;

    @Column({ type: 'enum', enum: TaskStatus })
    @ApiProperty({ enum: TaskStatus })
    statut: TaskStatus;

    @ManyToOne(() => OrdreReparation, (or) => or.tasks, { onDelete: 'CASCADE' })
    @ApiProperty({ type: () => OrdreReparation })
    ordreReparation: OrdreReparation;

    @OneToMany(() => Historique, (hist) => hist.task)
    historiques: Historique[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}