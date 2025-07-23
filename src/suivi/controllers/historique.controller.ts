import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { HistoriqueService } from '../services/historique.service';
import { ScanBadgeDto } from '../types/dtos/scan_badge.dto';
import { StartTaskDto } from '../types/dtos/start_tache.dto';
import { EndTaskDto } from '../types/dtos/terminer_tache.dto';
import { PauseTaskDto } from '../types/dtos/pause_tache.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

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

    @Post('start-task')
    startTask(@Body() dto: StartTaskDto) {
        return this.service.startTask(dto);
    }

    @Post('pause-task')
    pauseTask(@Body() dto: PauseTaskDto) {
        return this.service.pauseTask(dto);
    }

    @Post('end-task')
    endTask(@Body() dto: EndTaskDto) {
        return this.service.recordEndTask(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Lister tous les historiques' })
    @ApiQuery({ name: 'day', required: false})
    @ApiQuery({ name: 'month', required: false})
    @ApiQuery({ name: 'year', required: false})
    findAll(@Query('day') day?: string, @Query('month') month?: string, @Query('year') year?: string,) {
        return this.service.findAll(day, month, year);
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
