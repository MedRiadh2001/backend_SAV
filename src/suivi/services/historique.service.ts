import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/UserModule/entities/User.entity';
import { Repository, MoreThan, Between } from 'typeorm';
import { Historique } from '../entities/Historique.entity';
import { Tache } from '../entities/Tache.entity';
import { ScanBadgeDto } from '../types/dtos/scan_badge.dto';
import { PointageType } from '../types/enums/TypePointage.enum';
import { StatutTache } from '../types/enums/statutTache.enum';
import { OrdreReparationService } from './ordre-reparation.service';
import { TaskActionDto } from '../types/dtos/task_action.dto';

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
        } else if (previousHist.type && dto.type === PointageType.ENTREE) {
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

    async taskAction(dto: TaskActionDto, action: 'start-task' | 'pause-task' | 'end-task') {
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
        const now = new Date();

        switch (action) {
            case 'start-task':
                if (tache.statut === StatutTache.NON_DEMAREE) {
                    type = PointageType.WORKING;
                } else if (tache.statut === StatutTache.EN_PAUSE) {
                    type = PointageType.REPRISE_TACHE;
                } else {
                    throw new BadRequestException('Task already in progress or finished');
                }
                tache.statut = StatutTache.EN_COURS;
                break;

            case 'pause-task':
                if (tache.statut !== StatutTache.EN_COURS) {
                    throw new BadRequestException('Task must be in progress to pause it');
                }
                tache.statut = StatutTache.EN_PAUSE;
                type = PointageType.PAUSE_TACHE;
                break;

            case 'end-task':
                if (tache.statut !== StatutTache.EN_COURS) {
                    throw new BadRequestException('Task must be in progress to finish it');
                }
                tache.statut = StatutTache.TERMINEE;
                type = PointageType.FIN_TACHE;
                break;

            default:
                throw new BadRequestException('Invalid action');
        }

        await this.tacheRepo.save(tache);

        if (tache.ordreReparation) {
            await this.ordreReparationService.updateStatutOR(tache.ordreReparation.id);
        }

        const historique = this.historiqueRepo.create({
            technicien: user,
            tache,
            type,
            heure: now,
        });

        return this.historiqueRepo.save(historique);
    }

    async findAll(startDate?: string, endDate?: string) {
        let whereClause = {};

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            let end: Date;

            if (endDate) {
                end = new Date(endDate);
            } else {
                end = new Date();
            }
            end.setHours(23, 59, 59, 999);

            if (start > end) {
                throw new BadRequestException('startDate can not be greater then endDate');
            }

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
