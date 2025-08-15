import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { HistoriqueService } from '../services/historique.service';
import { ScanBadgeDto } from '../types/dtos/scan_badge.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TaskActionDto } from '../types/dtos/task_action.dto';

@ApiTags('Activity')
@Controller('mobile')
export class HistoriqueController {
    constructor(private readonly historiqueService: HistoriqueService) { }

    @Post('badge-scan')
    scanBadge(@Body() dto: ScanBadgeDto) {
        return this.historiqueService.scanBadge(dto);
    }

    @Get('activity/lastType/:badgeId')
    getLastType(@Param('badgeId') badgeId: string) {
        return this.historiqueService.getLastType(badgeId);
    }

    @Post('taskAction')
    @ApiOperation({ summary: 'Effectuer une action sur une tâche' })
    tacheAction(@Body() dto: TaskActionDto) {
        return this.historiqueService.taskAction(dto);
    }
}

@ApiTags('Activity')
@Controller('backoffice')
export class HistoriqueBackofficeController {
    constructor(private readonly historiqueService: HistoriqueService) { }
    @Get('activity/:technicienId')
    @ApiOperation({ summary: 'Lister tous les historiques entre deux dates' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Date de début (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Date de fin (YYYY-MM-DD), aujourd’hui par défaut si manquant' })
    findAll(
        @Param('technicienId', new ParseUUIDPipe()) id: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.historiqueService.findAll(id, startDate, endDate);
    }

    @Get('activity')
    @ApiOperation({ summary: 'Lister tous les historiques groupés par technicien (SQL GROUP BY)' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Date de début (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Date de fin (YYYY-MM-DD), aujourd’hui par défaut si manquant' })
    findAllGrouped(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.historiqueService.findAllTechniciansActivity(startDate, endDate);
    }


    // @Get('activity/all/:technicienId')
    // @ApiOperation({ summary: "Lister l'historique d'un technicien" })
    // findByTechnicien(@Param('technicienId', new ParseUUIDPipe()) id: string) {
    //     return this.historiqueService.findByTechnicien(id);
    // }

    // @Get('activity/today/:technicienId')
    // @ApiOperation({ summary: "Lister l'historique d'un technicien pour le jour courant uniquement" })
    // findByTechnicienToday(@Param('technicienId', new ParseUUIDPipe()) id: string) {
    //     return this.historiqueService.findByTechnicienToday(id);
    // }
}
