import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodeService {
  async generateORQrCode(orId: string): Promise<string> {
    const data = `${orId}`;
    return QRCode.toDataURL(data);
  }
}
