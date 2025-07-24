import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { HistoriqueService } from '../services/historique.service';
import { ScanBadgeDto } from '../types/dtos/scan_badge.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TaskActionDto } from '../types/dtos/task_action.dto';

@ApiTags('Historique')
@Controller('historique')
export class HistoriqueController {
    constructor(private readonly service: HistoriqueService) { }

    @Post('badge-scan')
    scanBadge(@Body() dto: ScanBadgeDto) {
        return this.service.scanBadge(dto);
    }

    @Get('lastType/:badgeId')
    getLastType(@Param('badgeId') badgeId: string) {
        return this.service.getLastType(badgeId);
    }

    @Post('task/:action')
    @ApiOperation({ summary: 'Effectuer une action sur une tâche (start-task | pause-task | end-task)' })
    tacheAction(@Param('action') action: 'start-task' | 'pause-task' | 'end-task', @Body() dto: TaskActionDto) {
        return this.service.taskAction(dto, action);
    }

    @Get()
    @ApiOperation({ summary: 'Lister tous les historiques entre deux dates' })
    @ApiQuery({ name: 'startDate', required: false, description: 'Date de début (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Date de fin (YYYY-MM-DD), aujourd’hui par défaut si manquant' })
    findAll(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return this.service.findAll(startDate, endDate);
    }

    @Get('all/:technicienId')
    @ApiOperation({ summary: "Lister l'historique d'un technicien" })
    findByTechnicien(@Param('technicienId', new ParseUUIDPipe()) id: string) {
        return this.service.findByTechnicien(id);
    }

    @Get('today/:technicienId')
    @ApiOperation({ summary: "Lister l'historique d'un technicien pour le jour courant uniquement" })
    findByTechnicienToday(@Param('technicienId', new ParseUUIDPipe()) id: string) {
        return this.service.findByTechnicienToday(id);
    }
}
