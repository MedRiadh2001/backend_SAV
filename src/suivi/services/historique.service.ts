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
import { OrdreReparationService } from './ordre-reparation.service';

@Injectable()
export class HistoriqueService {
    constructor(
        @InjectRepository(Historique) private historiqueRepo: Repository<Historique>,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Tache) private tacheRepo: Repository<Tache>,
        private ordreReparationService: OrdreReparationService,
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

        const previousHist = await this.getLastType(dto.badgeId)
        let type: PointageType;
        if (!previousHist) {
            type = PointageType.ENTREE;
        } else if (previousHist.type === PointageType.PAUSE) {
            type = PointageType.REPRISE;
        } else if (previousHist.type && dto.type === PointageType.ENTREE){
            throw new BadRequestException("Technicien déjà en entrée")
        } else {
            type = dto.type;
        }



        if (type) {
            const newHist = this.historiqueRepo.create({
                technicien: user,
                type,
                heure: new Date(),
            });

            const saved = await this.historiqueRepo.save(newHist);
            return {
                id: saved.id,
                type: saved.type,
                heure: saved.heure
            }
        } else {
            return previousHist
        };
    }

    async getLastType(badgeId: string) {
        const user = await this.userRepo.findOne({
            where: { badgeId },
            relations: ['role'],
        });
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        return await this.historiqueRepo.findOne({
            where: { technicien: { id: user.id }, heure: MoreThan(todayStart) },
            order: { heure: 'DESC' },
        });
    }

    async startTask(dto: StartTaskDto) {
        const user = await this.userRepo.findOne({
            where: { badgeId: dto.badgeId },
            relations: ['role'],
        });
        if (!user || user.role.name.toLowerCase() !== 'technicien') {
            throw new ForbiddenException();
        }

        const tache = await this.tacheRepo.findOne({
            where: { id: dto.tacheId },
            relations: ['ordreReparation'],
        });
        if (!tache) throw new NotFoundException('Tâche non trouvée');

        let type: PointageType;

        if (tache.statut === StatutTache.NON_DEMAREE) {
            type = PointageType.WORKING;
        } else if (tache.statut === StatutTache.EN_PAUSE) {
            type = PointageType.REPRISE_TACHE;
        } else {
            throw new BadRequestException('Task already in progress or finished');
        }

        tache.statut = StatutTache.EN_COURS;
        await this.tacheRepo.save(tache);

        const historique = this.historiqueRepo.create({
            technicien: user,
            tache,
            type,
            heure: new Date(),
        });
        const saved = await this.historiqueRepo.save(historique);

        if (tache.ordreReparation) {
            await this.ordreReparationService.updateStatutOR(tache.ordreReparation.id);
        }

        return saved;
    }


    async pauseTask(dto: PauseTaskDto) {
        const user = await this.userRepo.findOne({ where: { badgeId: dto.badgeId }, relations: ['role'] });
        if (!user || user.role.name.toLowerCase() !== 'technicien') throw new ForbiddenException();

        const tache = await this.tacheRepo.findOne({
            where: { id: dto.tacheId },
            relations: ['ordreReparation'],
        });
        if (!tache) throw new NotFoundException('Tâche non trouvée');

        if (tache.statut.toUpperCase() !== StatutTache.EN_COURS) {
            throw new BadRequestException("Tache non démarée")
        } else {
            tache.statut = StatutTache.EN_PAUSE;
            await this.tacheRepo.save(tache);
        }

        if (tache.ordreReparation) {
            await this.ordreReparationService.updateStatutOR(tache.ordreReparation.id);
        }

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

        const tache = await this.tacheRepo.findOne({
            where: { id: dto.tacheId },
            relations: ['ordreReparation'],
        });
        if (!tache) throw new NotFoundException('Tâche non trouvée');

        if (tache.statut.toUpperCase() !== StatutTache.EN_COURS) {
            throw new BadRequestException("Tache non démarée")
        } else {
            tache.statut = StatutTache.TERMINEE;
            await this.tacheRepo.save(tache);
        }

        if (tache.ordreReparation) {
            await this.ordreReparationService.updateStatutOR(tache.ordreReparation.id);
        }

        const hist = this.historiqueRepo.create({
            technicien: user,
            tache,
            type: PointageType.FIN_TACHE,
            heure: new Date(),
        });

        return this.historiqueRepo.save(hist);
    }

    async findAll(day?: string, month?: string, year?: string) {
        let whereClause = {};

        if (day && month && year) {
            const start = new Date(Number(year), Number(month) - 1, Number(day), 1, 0, 0, 0);
            const end = new Date(Number(year), Number(month) - 1, Number(day), 23, 59, 59, 999);

            whereClause = {
                heure: Between(start, end),
            };
        } else if (month && year) {
            const start = new Date(Number(year), Number(month) - 1, 1, 0, 0, 0);
            const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

            whereClause = {
                heure: Between(start, end),
            };
        } else if (month) {
            const now = new Date();
            const monthIndex = Number(month) - 1;

            const start = new Date(now.getFullYear(), monthIndex, 1, 0, 0, 0);
            const end = new Date(now.getFullYear(), monthIndex + 1, 0, 23, 59, 59, 999);

            whereClause = {
                heure: Between(start, end),
            };
        } else if (year) {
            const start = new Date(Number(year), 0, 1, 0, 0, 0);
            const end = new Date(Number(year), 11, 31, 23, 59, 59, 999);

            whereClause = {
                heure: Between(start, end),
            };
        }

        return this.historiqueRepo.find({
            where: whereClause,
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
