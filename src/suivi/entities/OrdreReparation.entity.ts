import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Tache } from "./Tache.entity";
import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";
import { StatutOR } from "../types/enums/statutOR.enum";

@Entity()
export class OrdreReparation implements IIdentifiable {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column()
    @ApiProperty()
    numOR: number;

    @Column()
    @ApiProperty()
    vehicule: string;

    @Column()
    @ApiProperty()
    client: string;

    @Column({ type: 'enum', enum: StatutOR, default: StatutOR.NON_DEMARE })
    @ApiProperty({ enum: StatutOR })
    statut: StatutOR;

    @OneToMany(() => Tache, (tache) => tache.ordreReparation)
    @ApiProperty({ type: () => Tache, isArray: true })
    taches: Tache[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}