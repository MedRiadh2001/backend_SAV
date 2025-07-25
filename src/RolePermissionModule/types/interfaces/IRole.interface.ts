import { IIdentifiable } from "src/shared/interfaces/IIdentifiable.interface";
import { IUser } from "src/UserModule/types/interfaces/IUser.interface";
import { IRolePermission } from "./IRolePermission.interface";

export interface IRole extends IIdentifiable {
    name: string;
    rolePermissions: IRolePermission[];
    users: IUser[] | string[];
    createdAt: Date;
    updatedAt: Date;
}