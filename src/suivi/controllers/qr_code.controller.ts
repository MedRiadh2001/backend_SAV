// qr-code.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { QrCodeService } from '../services/qr_code.service';

@Controller('qrcode')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Get('or/:id')
  async getQRCode(@Param('id') id: string) {
    const base64 = await this.qrCodeService.generateORQrCode(id);
    return { qrCode: base64 };
  }
}
