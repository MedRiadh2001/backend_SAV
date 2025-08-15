import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IConfiguration } from "../types/interfaces/IConfiguration.interface";

@Entity()
export class Configuration implements IConfiguration {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @Column({ default: false })
    @ApiProperty()
    parallelTasksPerTechnician: boolean;

    @Column({ default: false })
    @ApiProperty()
    multiTechniciansPerTask: boolean;

    @Column({ default: true })
    @ApiProperty()
    onlyCreatorEndTask: boolean;

    @Column({ default: false })
    @ApiProperty()
    restartTask: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
