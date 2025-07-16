import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdreReparation } from '../entities/OrdreReparation.entity';
import { CreateOrdreReparationDto } from '../types/dtos/create_ordre_reparation.dto';
import { StatutOR } from '../types/enums/statutOR.enum';

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

    async updateStatutOR(orId: string) {
        const or = await this.repo.findOne({
            where: { id: orId },
            relations: ['taches'],
        });

        if (!or) throw new BadRequestException('Ordre de réparation non trouvé');

        const statuts = or.taches.map((t) => t.statut);

        if (statuts.every((s) => s === 'NON_DEMAREE')) {
            or.statut = StatutOR.NON_DEMARE;
        } else if (statuts.every((s) => s === 'TERMINEE')) {
            or.statut = StatutOR.TERMINE;
        } else if (statuts.every((s) => s === 'EN_COURS' || s === 'EN_PAUSE')) {
            or.statut = StatutOR.EN_COURS;
        } else {
            or.statut = StatutOR.EN_COURS;
        }

        return this.repo.save(or);
    }

}
