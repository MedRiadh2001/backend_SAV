import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdreReparation } from '../entities/OrdreReparation.entity';
import { CreateOrdreReparationDto } from '../types/dtos/create_ordre_reparation.dto';
import { OrStatus } from '../types/enums/statutOR.enum';

@Injectable()
export class OrdreReparationService {
    constructor(@InjectRepository(OrdreReparation) private ORrepo: Repository<OrdreReparation>) { }

    create(dto: CreateOrdreReparationDto) {
        return this.ORrepo.save(this.ORrepo.create(dto));
    }

    async findAllToExport(page = 1, items = 10) {
        const [result, total] = await this.ORrepo.findAndCount({
            relations: ['taches'],
            skip: (page - 1) * items,
            take: items,
        });

        const lastPage = Math.ceil(total / items);
        const nextPage = page < lastPage ? page + 1 : null;

        return {
            result,
            total,
            page,
            lastPage,
            nextPage,
        };
    }

    async findAll(page = 1, items = 10, keyword?: string) {
        const qb = this.ORrepo.createQueryBuilder('or')
            .leftJoinAndSelect('or.taches', 'tache')
            .skip((page - 1) * items)
            .take(items);

        if (keyword) {
            qb.andWhere(
                `(LOWER(or.vehicule) LIKE :kw OR LOWER(or.client) LIKE :kw OR CAST(or.numOR AS TEXT) LIKE :kw)`,
                { kw: `%${keyword.toLowerCase()}%` }
            );
        }

        const [result, total] = await qb.getManyAndCount();

        const lastPage = Math.ceil(total / items);
        const nextPage = page < lastPage ? page + 1 : null;

        return {
            result,
            total,
            page,
            lastPage,
            nextPage,
        };
    }


    findOne(id: string) {
        return this.ORrepo.findOne({ where: { id }, relations: ['taches'] });
    }

    async updateStatutOR(orId: string) {
        const or = await this.ORrepo.findOne({
            where: { id: orId },
            relations: ['taches'],
        });

        if (!or) throw new BadRequestException('Ordre de réparation non trouvé');

        const statuts = or.taches.map((t) => t.statut);

        if (statuts.every((s) => s === 'NOT_STARTED')) {
            or.statut = OrStatus.NOT_STARTED;
        } else if (statuts.every((s) => s === 'COMPLETED')) {
            or.statut = OrStatus.COMPLETED;
        } else if (statuts.every((s) => s === 'IN_PROGRESS' || s === 'PAUSED')) {
            or.statut = OrStatus.IN_PROGRESS;
        } else {
            or.statut = OrStatus.IN_PROGRESS;
        }
        
        return this.ORrepo.save(or);
    }

}
