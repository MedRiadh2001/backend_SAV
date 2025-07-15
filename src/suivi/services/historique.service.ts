import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/UserModule/entities/User.entity';
import { Repository, MoreThan } from 'typeorm';
import { Historique } from '../entities/Historique.entity';
import { Tache } from '../entities/Tache.entity';
import { ScanBadgeDto } from '../types/dtos/scan_badge.dto';
import { StartTaskDto } from '../types/dtos/start_tache.dto';
import { EndTaskDto } from '../types/dtos/terminer_tache.dto';
import { PointageType } from '../types/enums/TypePointage.enum';
import { StatutTache } from '../types/enums/statutTache.enum';
import { PauseTaskDto } from '../types/dtos/pause_tache.dto';

@Injectable()
export class HistoriqueService {
    constructor(
        @InjectRepository(Historique) private historiqueRepo: Repository<Historique>,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Tache) private tacheRepo: Repository<Tache>,
    ) { }

    async scanBadge(dto: ScanBadgeDto) {
        const user = await this.userRepo.findOne({ where: { badgeId: dto.badgeId }, relations: ['role'] });
        if (!user) throw new BadRequestException("User not found");
        if (user.role.name.toLowerCase() !== 'technicien') throw new BadRequestException("User doit être technicien");

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const alreadyScanned = await this.historiqueRepo.findOne({
            where: {
                technicien: { id: user.id },
                heure: MoreThan(todayStart),
            },
        });

        let type: PointageType;

        if (!alreadyScanned) {
            // Premier scan de la journée => ENTREE obligatoire
            type = PointageType.ENTREE;
        } else {
            // Scan suivant : type obligatoire
            if (!dto.type) {
                throw new BadRequestException('Vous devez préciser le type de pointage après l’entrée');
            }
            type = dto.type;
        }

        const hist = this.historiqueRepo.create({ technicien: user, type, heure: new Date() });
        return this.historiqueRepo.save(hist);
    }


    async startTask(dto: StartTaskDto) {
        const user = await this.userRepo.findOne({ where: { badgeId: dto.badgeId }, relations: ['role'] });
        if (!user || user.role.name.toLowerCase() !== 'technicien') throw new ForbiddenException();

        const tache = await this.tacheRepo.findOneBy({ id: dto.tacheId });
        if (!tache) throw new NotFoundException('Tâche non trouvée');

        tache.statut = StatutTache.EN_COURS;
        await this.tacheRepo.save(tache);

        const hist = this.historiqueRepo.create({ technicien: user, tache, type: PointageType.WORKING, heure: new Date() });
        return this.historiqueRepo.save(hist);
    }

    async pauseTask(dto: PauseTaskDto) {
        const user = await this.userRepo.findOne({ where: { badgeId: dto.badgeId } });
        if (!user || user.role.name.toLowerCase() !== 'technicien') throw new ForbiddenException();

        const tache = await this.tacheRepo.findOneBy({ id: dto.tacheId });
        if (!tache) throw new NotFoundException('Tâche non trouvée');

        tache.statut = StatutTache.EN_PAUSE;
        await this.tacheRepo.save(tache);

        const hist = this.historiqueRepo.create({
            technicien: user,
            tache,
            type: PointageType.PAUSE_TACHE,
            heure: new Date(),
        });

        return this.historiqueRepo.save(hist);
    }

    async recordEndTask(dto: EndTaskDto) {
        const user = await this.userRepo.findOne({ where: { badgeId: dto.badgeId } });
        if (!user || user.role.name.toLowerCase() !== 'technicien') throw new ForbiddenException();

        const tache = await this.tacheRepo.findOneBy({ id: dto.tacheId });
        if (!tache) throw new NotFoundException('Tâche non trouvée');

        tache.statut = StatutTache.TERMINEE;
        await this.tacheRepo.save(tache);

        const hist = this.historiqueRepo.create({
            technicien: user,
            tache,
            type: PointageType.FIN_TACHE,
            heure: new Date(),
        });

        return this.historiqueRepo.save(hist);
    }
}
