import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { OrdreReparation } from '../entities/OrdreReparation.entity';
import { Tache } from '../entities/Tache.entity';
import { CreateTacheDto } from '../types/dtos/create_tache.dto';
import { StatutTache } from '../types/enums/statutTache.enum';
import { Historique } from '../entities/Historique.entity';

@Injectable()
export class TacheService {
    constructor(
        @InjectRepository(Tache) private repo: Repository<Tache>,
        @InjectRepository(OrdreReparation) private orRepo: Repository<OrdreReparation>,
        @InjectRepository(Historique) private historiqueRepo: Repository<Historique>
    ) { }

    async create(dto: CreateTacheDto) {
        const ordre = await this.orRepo.findOneBy({ id: dto.ordreReparationId });
        if (!ordre) throw new NotFoundException('Ordre de réparation non trouvé');
        const tache = this.repo.create({ ...dto, statut: StatutTache.NON_DEMAREE, ordreReparation: ordre });
        return this.repo.save(tache);
    }

    findByOR(ordreReparationId: string) {
        return this.repo.find({ where: { ordreReparation: { id: ordreReparationId } } });
    }
}
