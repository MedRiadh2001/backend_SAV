import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { TacheService } from '../services/tache.service';
import { CreateTacheDto } from '../types/dtos/create_tache.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@Controller('backoffice/tasks')
export class TacheController {
    constructor(private readonly TasksService: TacheService) { }
    
    @Post()
    create(@Body() dto: CreateTacheDto) {
        return this.TasksService.create(dto);
    }

    @Get(':ordreReparationId')
    getByOR(@Param('ordreReparationId', new ParseUUIDPipe()) id: string) {
        return this.TasksService.findByOR(id);
    }
}
