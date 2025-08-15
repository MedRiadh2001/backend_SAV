import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/UserModule/entities/User.entity';
import { Repository, MoreThan, Between, In } from 'typeorm';
import { Historique } from '../entities/Historique.entity';
import { Tache } from '../entities/Tache.entity';
import { ScanBadgeDto } from '../types/dtos/scan_badge.dto';
import { HistoriqueType } from '../types/enums/TypePointage.enum';
import { TaskStatus } from '../types/enums/statutTache.enum';
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
        let type: HistoriqueType;
        if (!previousHist) {
            type = HistoriqueType.ENTRY;
        } else if (previousHist.type === HistoriqueType.BREAK) {
            type = HistoriqueType.RESUME;
        } else if (previousHist.type && dto.type === HistoriqueType.ENTRY) {
            throw new BadRequestException("Technicien déjà en entrée")
        } else if (previousHist.type === HistoriqueType.EXIT && dto.type === HistoriqueType.EXIT) {
            throw new BadRequestException("Technicien has exit")
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

    async taskAction(dto: TaskActionDto) {
        const user = await this.userRepo.findOne({
            where: { badgeId: dto.badgeId },
            relations: ['role'],
        });
        if (!user || user.role.name.toLowerCase() !== 'technicien') {
            throw new ForbiddenException();
        }

        const task = await this.tacheRepo.findOne({
            where: { id: dto.tacheId },
            relations: ['ordreReparation'],
        });
        if (!task) throw new NotFoundException('Tâche non trouvée');

        let type: HistoriqueType;
        const now = new Date();

        const action = dto.action;
        switch (action) {
            case 'START_TASK':
                const lastStart = await this.historiqueRepo.findOne({
                    where: {
                        technicien: { id: user.id },
                        type: In([HistoriqueType.WORKING, HistoriqueType.TASK_RESUME]),
                    },
                    order: { heure: 'DESC' },
                    relations: ['task'],
                });

                if (lastStart) {
                    const lastEnd = await this.historiqueRepo.findOne({
                        where: {
                            technicien: { id: user.id },
                            task: { id: lastStart.task.id },
                            type: HistoriqueType.END_TASK,
                            heure: MoreThan(lastStart.heure),
                        },
                    });

                    const isSameTask = lastStart.task.id === dto.tacheId;

                    if (!lastEnd && !isSameTask) {
                        throw new BadRequestException('Ce technicien a déjà une tâche en cours.');
                    }
                }

                if (task.statut === TaskStatus.NOT_STARTED) {
                    type = HistoriqueType.WORKING;
                } else if (task.statut === TaskStatus.PAUSED) {
                    type = HistoriqueType.TASK_RESUME;
                } else {
                    throw new BadRequestException('Task already in progress or finished');
                }
                task.statut = TaskStatus.IN_PROGRESS;
                break;

            case 'PAUSE_TASK':
                if (task.statut !== TaskStatus.IN_PROGRESS) {
                    throw new BadRequestException('Task must be in progress to pause it');
                }
                task.statut = TaskStatus.PAUSED;
                type = HistoriqueType.TASK_PAUSED;
                break;

            case 'END_TASK':
                if (task.statut !== TaskStatus.IN_PROGRESS) {
                    throw new BadRequestException('Task must be in progress to finish it');
                }
                const lastStartTask = await this.historiqueRepo.findOne({
                    where: {
                        task: { id: dto.tacheId },
                        type: In([HistoriqueType.WORKING, HistoriqueType.TASK_RESUME]),
                    },
                    order: { heure: 'DESC' },
                    relations: ['technicien'],
                });

                if (!lastStartTask || lastStartTask.technicien.id !== user.id) {
                    throw new BadRequestException('Seul le technicien ayant démarré la tâche peut la clôturer.');
                }
                task.statut = TaskStatus.COMPLETED;
                type = HistoriqueType.END_TASK;
                break;

            default:
                throw new BadRequestException('Invalid action');
        }

        await this.tacheRepo.save(task);

        if (task.ordreReparation) {
            await this.ordreReparationService.updateStatutOR(task.ordreReparation.id);
        }

        const historique = this.historiqueRepo.create({
            technicien: user,
            task,
            type,
            heure: now,
        });

        return this.historiqueRepo.save(historique);
    }

    async findAll(id: string, startDate?: string, endDate?: string) {
        const user = await this.userRepo.findOne({ where: { id } })
        if (!user) {
            throw new BadRequestException('user not found')
        }

        const whereClause: any = {
            technicien: { id: user.id },
        };

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

            whereClause.heure = Between(start, end);
        }

        return this.findByTechnicien(whereClause)
    }

    async findByTechnicien(whereClause: {}) {
        return this.historiqueRepo.find({
            where: whereClause,
            relations: ['technicien', 'task'],
            order: { heure: 'ASC' }
        })
    }

    async findAllTechniciansActivity(startDate?: string, endDate?: string) {
        const qb = this.historiqueRepo
            .createQueryBuilder('historique')
            .select(`json_build_object(
        'id', technicien.id,
        'firstName', technicien."firstName",
        'lastName', technicien."lastName",
        'badgeId', technicien."badgeId"
    )`, 'technicien')
            .addSelect(`json_agg(
      json_build_object(
        'id', historique.id,
        'type', historique.type,
        'heure', historique.heure,
        'task', json_build_object(
            'id', task.id,
            'titre', task.titre,
            'status', task.statut,
            'ordreReparation', json_build_object(
                'id', "ordreReparation".id,
                'numOr', "ordreReparation"."numOR"
            )
        )
      ) ORDER BY historique.heure
    )`, 'historiques')
            .leftJoin('historique.technicien', 'technicien')
            .leftJoin('historique.task', 'task')
            .leftJoin('task.ordreReparation', 'ordreReparation')
            .groupBy('technicien.id, technicien.firstName, technicien.lastName, technicien.badgeId')
            .orderBy('technicien.firstName', 'ASC');

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);

            const end = endDate ? new Date(endDate) : new Date();
            end.setHours(23, 59, 59, 999);

            if (start > end) {
                throw new BadRequestException('startDate ne peut pas être après endDate.');
            }

            qb.where('historique.heure BETWEEN :start AND :end', { start, end });
        }

        return qb.getRawMany();
    }

    // async findByTechnicienToday(id: string) {
    //     const todayStart = new Date();
    //     todayStart.setHours(0, 0, 0, 0);

    //     const todayEnd = new Date();
    //     todayEnd.setHours(23, 59, 59, 999);

    //     return this.historiqueRepo.find({
    //         where: {
    //             technicien: { id },
    //             heure: Between(todayStart, todayEnd)
    //         },
    //         relations: ['technicien', 'task'],
    //         order: { heure: 'ASC' }
    //     })
    // }
}
