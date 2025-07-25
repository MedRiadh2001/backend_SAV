import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";
import { IHistorique } from "./IHistorique.interface";
import { TaskStatus } from "../enums/statutTache.enum";
import { IOrdreReparation } from "./IOrdreReparation.interface";

export interface ITache extends IIdentifiable {
    titre: string;
    details: string;
    statut: TaskStatus;
    ordreReparation: IOrdreReparation | string;
    historiques: IHistorique[] | string[];
}