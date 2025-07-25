import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";
import { IRole } from "./IRole.interface";
import { IPermission } from "./IPermission.interface";

export interface IRolePermission extends IIdentifiable {
    role: IRole;
    permission: IPermission;

}