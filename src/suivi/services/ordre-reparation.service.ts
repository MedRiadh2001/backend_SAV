import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdreReparation } from '../entities/OrdreReparation.entity';
import { CreateOrdreReparationDto } from '../types/dtos/create_ordre_reparation.dto';
import { OrStatus } from '../types/enums/statutOR.enum';
import { Tache } from '../entities/Tache.entity';
import { TaskStatus } from '../types/enums/statutTache.enum';

@Injectable()
export class OrdreReparationService {
    constructor(
        @InjectRepository(OrdreReparation) private ORrepo: Repository<OrdreReparation>,
        @InjectRepository(Tache) private tacheRepo: Repository<Tache>
    ) { }

    async create(dto: CreateOrdreReparationDto) {
        const { taches, ...orData } = dto;

        const ordreReparation = this.ORrepo.create(orData);
        const savedOR = await this.ORrepo.save(ordreReparation);

        if (taches?.length) {
            for (const tacheDto of taches) {
                const tache = this.tacheRepo.create({
                    ...tacheDto,
                    statut: TaskStatus.NOT_STARTED,
                    ordreReparation: savedOR,
                });
                await this.tacheRepo.save(tache);
            }
        }

        return {
            savedOR,
            taches
        };
    }

    async findAllToExport(page = 1, items = 10) {
        const [result, total] = await this.ORrepo.findAndCount({
            relations: ['tasks'],
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

    async findAll(page = 1, items = 10, keyword?: string, startDate?: string, endDate?: string, OrStatut?: OrStatus) {
        const qb = this.ORrepo.createQueryBuilder('or')
            .leftJoinAndSelect('or.tasks', 'tache')
            .skip((page - 1) * items)
            .take(items);

        if (keyword) {
            qb.andWhere(
                `(LOWER(or.vehicule) LIKE :kw OR LOWER(or.client) LIKE :kw OR CAST(or.numOR AS TEXT) LIKE :kw)`,
                { kw: `%${keyword.toLowerCase()}%` }
            );
        }

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = endDate ? new Date(endDate) : new Date();
            end.setHours(23, 59, 59, 999);

            if (start > end) {
                throw new BadRequestException('startDate ne peut pas être après endDate.');
            }

            qb.andWhere('or.createdAt BETWEEN :start AND :end', { start, end });
        }

        if (OrStatut) {
            qb.andWhere('or.statut = :status', { status: OrStatut });
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
        return this.ORrepo.findOne({ where: { id }, relations: ['tasks'] });
    }

    async updateStatutOR(orId: string) {
        const or = await this.ORrepo.findOne({
            where: { id: orId },
            relations: ['tasks'],
        });

        if (!or) throw new BadRequestException('Ordre de réparation non trouvé');

        const statuts = or.tasks.map((t) => t.statut);

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
