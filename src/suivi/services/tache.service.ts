import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { OrdreReparation } from '../entities/OrdreReparation.entity';
import { Tache } from '../entities/Tache.entity';
import { CreateTacheDto } from '../types/dtos/create_tache.dto';
import { TaskStatus } from '../types/enums/statutTache.enum';
import { Historique } from '../entities/Historique.entity';

@Injectable()
export class TacheService {
    constructor(
        @InjectRepository(Tache) private taskRepo: Repository<Tache>,
        @InjectRepository(OrdreReparation) private orRepo: Repository<OrdreReparation>,
        @InjectRepository(Historique) private historiqueRepo: Repository<Historique>
    ) { }

    async create(dto: CreateTacheDto) {
        const ordre = await this.orRepo.findOneBy({ id: dto.ordreReparationId });
        if (!ordre) throw new NotFoundException('Ordre de réparation non trouvé');
        const tache = this.taskRepo.create({ ...dto, statut: TaskStatus.NOT_STARTED, ordreReparation: ordre });
        return this.taskRepo.save(tache);
    }

    async findByOR(ordreReparationId: string) {
        const taches = await this.taskRepo.find({
            where: { ordreReparation: { id: ordreReparationId } },
            relations: ['historiques', 'historiques.technicien'],
        });

        return taches.map((tache) => {
            const techniciensMap = new Map(
                tache.historiques
                    .filter(h => h.technicien)
                    .map(h => [h.technicien.id, h.technicien])
            );

            return {
                id: tache.id,
                titre: tache.titre,
                statut: tache.statut,
                ordreReparation: tache.ordreReparation,
                createdAt: tache.createdAt,
                updatedAt: tache.updatedAt,
                techniciens: [...techniciensMap.values()],
            };
        });
    }


}
