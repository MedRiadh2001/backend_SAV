import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Res } from '@nestjs/common';
import { OrdreReparationService } from '../services/ordre-reparation.service';
import { CreateOrdreReparationDto } from '../types/dtos/create_ordre_reparation.dto';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExcelExportService } from 'src/shared/excel_export.service';
import { Response } from 'express';
import { OrStatus } from '../types/enums/statutOR.enum';

@ApiTags('RepairOrders')
@Controller('backoffice/RepairOrders')
export class OrdreReparationBackofficeController {
    constructor(private readonly ORService: OrdreReparationService, private readonly excelExportService: ExcelExportService) { }

    @Post()
    create(@Body() dto: CreateOrdreReparationDto) {
        return this.ORService.create(dto);
    }

    @Get('export')
    @ApiOperation({ summary: 'Exporter les OR en Excel' })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'items', required: false })
    async exportOR(@Res() res: Response, @Query('page') page: number, @Query('items') items: number,) {
        const { result } = await this.ORService.findAllToExport(page, items);

        const columns = [
            { header: 'Num OR', key: 'numOR' },
            { header: 'Client', key: 'client' },
            { header: 'Véhicule', key: 'vehicule' },
            { header: 'Statut', key: 'statut' },
            { header: 'Tâches', key: 'tachesList' },
        ];

        const formatted = result.map(or => ({
            ...or,
            tachesList: or.tasks?.map(t => t.titre).join(', ') || '',
        }));

        await this.excelExportService.exportToExcel(formatted, columns, 'Ordres_Reparation', res);
    }

    @Get()
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'items', required: false })
    @ApiQuery({ name: 'keyword', required: false })
    @ApiQuery({ name: 'startDate', required: false, description: 'Date de début (YYYY-MM-DD)' })
    @ApiQuery({ name: 'endDate', required: false, description: 'Date de fin (YYYY-MM-DD), aujourd\'hui par défaut si manquant' })
    @ApiQuery({name: 'OrStatut', required: false, description: 'Statut de l\'OR'})
    findAll(
        @Query('page') page?: number,
        @Query('items') items?: number,
        @Query('keyword') keyword?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('OrStatut') OrStatus?: OrStatus
    ) {
        return this.ORService.findAll(page, items, keyword, startDate, endDate, OrStatus);
    }


    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.ORService.findOne(id);
    }

}

@ApiTags('RepairOrders')
@Controller('RepairOrders')
export class OrdreReparationController {
    constructor(private readonly ORService: OrdreReparationService) { }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.ORService.findOne(id);
    }

}
