import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigurationService } from '../services/configuration.service';
import { UpdateConfigurationDto } from '../types/dtos/update_configuration';

@ApiTags('Configuration')
@Controller('backoffice/configuration')
export class ConfigurationController {
    constructor(private readonly configService: ConfigurationService) { }

    @Get()
    @ApiOperation({})
    find() {
        return this.configService.get();
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Mettre à jour la configuration' })
    updateConfig(@Param('id', new ParseUUIDPipe()) id: string, @Body() dto: UpdateConfigurationDto) {
        return this.configService.update(id, dto);
    }
}
