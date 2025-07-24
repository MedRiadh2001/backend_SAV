import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Res } from '@nestjs/common';
import { OrdreReparationService } from '../services/ordre-reparation.service';
import { CreateOrdreReparationDto } from '../types/dtos/create_ordre_reparation.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExcelExportService } from 'src/shared/excel_export.service';
import { Response } from 'express';

@ApiTags('Ordres de Réparation')
@Controller('ordre-reparation')
export class OrdreReparationController {
    constructor(private readonly service: OrdreReparationService, private readonly excelExportService: ExcelExportService) { }

    @Post()
    create(@Body() dto: CreateOrdreReparationDto) {
        return this.service.create(dto);
    }

    @Get('export')
    @ApiOperation({ summary: 'Exporter les OR en Excel' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'items', required: false })
    async exportOR(@Res() res: Response, @Query('page') page: number, @Query('items') items: number,) {
        const { result } = await this.service.findAllToExport(page, items);

        const columns = [
            { header: 'Num OR', key: 'numOR' },
            { header: 'Client', key: 'client' },
            { header: 'Véhicule', key: 'vehicule' },
            { header: 'Statut', key: 'statut' },
            { header: 'Tâches', key: 'tachesList' },
        ];

        const formatted = result.map(or => ({
            ...or,
            tachesList: or.taches?.map(t => t.titre).join(', ') || '',
        }));

        await this.excelExportService.exportToExcel(formatted, columns, 'Ordres_Reparation', res);
    }

    @Get()
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'items', required: false })
    @ApiQuery({ name: 'keyword', required: false })
    findAll(@Query('page') page?: number, @Query('items') items?: number, @Query('keyword') keyword?: string) {
        return this.service.findAll(page, items, keyword);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.service.findOne(id);
    }

}
