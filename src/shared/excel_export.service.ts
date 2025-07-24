import { Injectable } from '@nestjs/common';
import { Workbook } from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ExcelExportService {
    async exportToExcel(data: any[], columns: { header: string, key: string }[], fileName: string, res: Response) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet(fileName);

        worksheet.columns = columns;
        worksheet.addRows(data);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    }
}
