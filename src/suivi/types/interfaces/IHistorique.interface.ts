import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";
import { IUser } from "src/UserModule/types/interfaces/IUser.interface";
import { HistoriqueType } from "../enums/TypePointage.enum";
import { ITache } from "./ITache.interface";

export interface IHistorique extends IIdentifiable {
    technicien: IUser;
    task?: ITache | string;
    type: HistoriqueType;
    heure: Date;
}