import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/UserModule/entities/User.entity';
import { Repository, MoreThan, Between } from 'typeorm';
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
        const user = await this.userRepo.findOne({
            where: { badgeId: dto.badgeId },
            relations: ['role'],
        });

        if (!user || user.role.name.toLowerCase() !== 'technicien') {
            throw new BadRequestException('User doit être technicien');
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const previousHist = await this.historiqueRepo.findOne({
            where: { technicien: { id: user.id }, heure: MoreThan(todayStart) },
            order: { heure: 'DESC' },
        });

        let type: PointageType;
        if (!previousHist) {
            type = PointageType.ENTREE;
        } else if (previousHist.type === PointageType.PAUSE) {
            type = PointageType.REPRISE;
        } else {
            type = dto.type;
        }

        const newHist = this.historiqueRepo.create({
            technicien: user,
            type,
            heure: new Date(),
        });

        const saved = await this.historiqueRepo.save(newHist);

        return {
            id: saved.id,
            type: saved.type,
            heure: saved.heure,
            previousType: previousHist?.type || null,
        };
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
        const user = await this.userRepo.findOne({ where: { badgeId: dto.badgeId }, relations: ['role'] });
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
        const user = await this.userRepo.findOne({ where: { badgeId: dto.badgeId }, relations: ['role'] });
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

    async findAll() {
        return this.historiqueRepo.find({
            relations: ['technicien', 'tache'],
            order: { heure: 'ASC' },
        });
    }

    async findByTechnicien(id: string) {
        return this.historiqueRepo.find({
            where: { technicien: { id } },
            relations: ['technicien', 'tache']
        })
    }

    async findByTechnicienToday(id: string) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        return this.historiqueRepo.find({
            where: {
                technicien: { id },
                heure: Between(todayStart, todayEnd)
            },
            relations: ['technicien', 'tache'],
            order: { heure: 'ASC' }
        })
    }
}
