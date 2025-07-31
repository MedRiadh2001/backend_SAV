import { IIdentifiable } from 'src/shared/interfaces/IIdentifiable.interface';
import { UserStatus } from '../enums/UserStatus.enum';
import { IRole } from 'src/RolePermissionModule/types/interfaces/IRole.interface';

export interface IUser extends IIdentifiable {
    username?: string;
    password?: string;
    lastName: string;
    firstName: string;
    statut: UserStatus;
    badgeId: string;
    role: IRole | string;
    isTechnician: boolean;
}
