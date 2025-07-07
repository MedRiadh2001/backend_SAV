import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.role?.rolePermissions) {
      throw new ForbiddenException('Rôle ou permissions non trouvés');
    }

    const userPermissions = user.role.rolePermissions.map((rp) => rp.permission.name);
    const hasAccess = requiredPermissions.every((perm) => userPermissions.includes(perm));
    if (!hasAccess) throw new ForbiddenException('Permissions insuffisantes');

    return true;
  }
}
