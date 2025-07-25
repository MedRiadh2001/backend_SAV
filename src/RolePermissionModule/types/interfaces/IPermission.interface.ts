import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";
import { IRolePermission } from "./IRolePermission.interface";

export interface IPermission extends IIdentifiable {
    name: string;
    mainPermission: IPermission | string;
    secondaryPermission: IPermission[] | string[];
    rolePermissions: IRolePermission[];

}