import { Module } from '@nestjs/common';
import { Configuration } from './entities/Configuration.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationService } from './services/configuration.service';
import { ConfigurationController } from './controllers/controllers.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Configuration]),
    ],
    controllers: [ConfigurationController],
    providers: [ConfigurationService],
    exports: [ConfigurationService]
})
export class ConfigurationModule { }
