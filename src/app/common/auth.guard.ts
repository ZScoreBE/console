import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./services/auth.service";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  if (!authService.isAuthorized()) {
    authService.logout();
    router.navigateByUrl('/sign-in?redirectUrl=' + btoa(state.url)).then();
    return false;
  }

  const data = route.data;

  if (!data || !data['role']) {
    return true;
  }

  if (authService.tokenIncludesRole(data['role'])) {
    return true;
  } else {
    router.navigateByUrl('/').then();
    return false;
  }
};
