import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateConfigurationDto {
    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({ description: 'Permet à un technicien d\'avoir plusieurs tâches en parallèle' })
    parallelTasksPerTechnician?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({ description: 'Permet à plusieurs techniciens de travailler sur la même tâche' })
    multiTechniciansPerTask?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({ description: 'Seul le créateur de la tâche peut la clôturer' })
    onlyCreatorEndTask?: boolean;

    @IsOptional()
    @IsBoolean()
    @ApiPropertyOptional({ description: 'Permet de recommencer une tâche' })
    restartTask?: boolean;
}
