import { Body, Controller, Post } from '@nestjs/common';
import { HistoriqueService } from '../services/historique.service';
import { ScanBadgeDto } from '../types/dtos/scan_badge.dto';
import { StartTaskDto } from '../types/dtos/start_tache.dto';
import { EndTaskDto } from '../types/dtos/terminer_tache.dto';
import { PauseTaskDto } from '../types/dtos/pause_tache.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Historique')
@Controller('historique')
export class HistoriqueController {
    constructor(private readonly service: HistoriqueService) { }

    @Post('badge-scan')
    scanBadge(@Body() dto: ScanBadgeDto) {
        return this.service.scanBadge(dto);
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
}
