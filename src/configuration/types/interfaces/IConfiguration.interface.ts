import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";

export interface IConfiguration extends IIdentifiable {
    parallelTasksPerTechnician: boolean;
    multiTechniciansPerTask: boolean;
    onlyCreatorEndTask: boolean;
    restartTask: boolean
}