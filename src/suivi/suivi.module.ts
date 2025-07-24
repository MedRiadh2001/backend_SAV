import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Historique } from './entities/Historique.entity';
import { OrdreReparation } from './entities/OrdreReparation.entity';
import { Tache } from './entities/Tache.entity';
import { OrdreReparationService } from './services/ordre-reparation.service';
import { TacheService } from './services/tache.service';
import { HistoriqueController } from './controllers/historique.controller';
import { OrdreReparationController } from './controllers/ordre-reparation.controller';
import { TacheController } from './controllers/tache.controller';
import { HistoriqueService } from './services/historique.service';
import { UserModule } from 'src/UserModule/user.module';
import { User } from 'src/UserModule/entities/User.entity';
import { ExcelExportService } from 'src/shared/excel_export.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Historique, OrdreReparation, Tache, User]),
        UserModule
    ],
    controllers: [OrdreReparationController, TacheController, HistoriqueController,],
    providers: [OrdreReparationService, TacheService, HistoriqueService, ExcelExportService],
    exports: [OrdreReparationService, TacheService, HistoriqueService]
})
export class SuiviModule { }
