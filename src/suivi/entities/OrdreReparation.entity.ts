import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Tache } from "./Tache.entity";
import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";
import { OrStatus } from "../types/enums/statutOR.enum";

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

    @Column({ type: 'enum', enum: OrStatus, default: OrStatus.NOT_STARTED })
    @ApiProperty({ enum: OrStatus })
    statut: OrStatus;

    @OneToMany(() => Tache, (tache) => tache.ordreReparation)
    @ApiProperty({ type: () => Tache, isArray: true })
    taches: Tache[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}