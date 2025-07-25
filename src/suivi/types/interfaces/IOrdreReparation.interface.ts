import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";
import { OrStatus } from "../enums/statutOR.enum";
import { ITache } from "./ITache.interface";

export interface IOrdreReparation extends IIdentifiable {
    numOR: number;
    vehicule: string;
    client: string;
    statut: OrStatus;
    tasks: ITache[] | string[];
}