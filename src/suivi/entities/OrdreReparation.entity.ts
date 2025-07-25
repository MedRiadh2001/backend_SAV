import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Tache } from "./Tache.entity";
import { OrStatus } from "../types/enums/statutOR.enum";
import { IOrdreReparation } from "../types/interfaces/IOrdreReparation.interface";

@Entity()
export class OrdreReparation implements IOrdreReparation {
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

    @Column({ type: 'enum', enum: OrStatus, default: OrStatus.NOT_STARTED })
    @ApiProperty({ enum: OrStatus })
    statut: OrStatus;

    @OneToMany(() => Tache, (tache) => tache.ordreReparation)
    @ApiProperty({ type: () => Tache, isArray: true })
    tasks: Tache[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}