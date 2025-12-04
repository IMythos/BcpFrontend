import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles: string[] = route.data['allowedRoles'];
  const userRole = authService.getUserRole();

  const isDashboardRoute = route.url[0]?.path === 'dashboard';

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(isDashboardRoute ? ['/dashboard-login'] : ['/dashboard/client']);
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    console.warn('RoleGuard: La ruta no especificó allowedRoles. Acceso concedido por defecto.');
    return true;
  }

  if (userRole && allowedRoles.includes(userRole)) {
    console.log(`RoleGuard: Acceso concedido. Rol: ${userRole}`);
    return true;
  } else {

    console.log(`RoleGuard: Acceso denegado. Rol: ${userRole}. Roles permitidos: ${allowedRoles.join(', ')}`);
    return router.createUrlTree(['/unauthorized']);
  }
};
