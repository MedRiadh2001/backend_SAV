import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdreReparation } from '../entities/OrdreReparation.entity';
import { CreateOrdreReparationDto } from '../types/dtos/create_ordre_reparation.dto';

@Injectable()
export class OrdreReparationService {
    constructor(@InjectRepository(OrdreReparation) private repo: Repository<OrdreReparation>) { }

    create(dto: CreateOrdreReparationDto) {
        return this.repo.save(this.repo.create(dto));
    }

    async findAll(page = 1, limit = 10) {
        const [data, total] = await this.repo.findAndCount({
            relations: ['taches'],
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
    }

    findOne(id: string) {
        return this.repo.findOne({ where: { id }, relations: ['taches'] });
    }
}
