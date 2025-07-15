import { Controller, Get, Param } from '@nestjs/common';
import { QrCodeService } from '../services/qr_code.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('qrcode')
@Controller('qrcode')
export class QrCodeController {
  constructor(private readonly qrCodeService: QrCodeService) {}

  @Get('or/:id')
  async getQRCode(@Param('id') id: string) {
    const base64 = await this.qrCodeService.generateORQrCode(id);
    return { qrCode: base64 };
  }
}
