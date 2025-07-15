import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { OrdreReparationService } from '../services/ordre-reparation.service';
import { CreateOrdreReparationDto } from '../types/dtos/create_ordre_reparation.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('ordre-reparation')
export class OrdreReparationController {
    constructor(private readonly service: OrdreReparationService) { }

    @Post()
    create(@Body() dto: CreateOrdreReparationDto) {
        return this.service.create(dto);
    }

    @Get()
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.service.findAll(page, limit);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.service.findOne(id);
    }
}
