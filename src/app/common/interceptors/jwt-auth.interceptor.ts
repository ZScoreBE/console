import {HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from "@angular/core";
import {ConfigService} from "../services/config.service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {EMPTY, mergeMap, Observable} from "rxjs";

export const jwtAuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (isPublicRoute(req.url)) {
    return next(req);
  }

  const authService: AuthService = inject(AuthService);

  if (authService.hasValidAccessToken()) {
    return addAuthorizationHeader(req, next, authService.getToken());
  }

  if (authService.hasValidRefreshToken()) {
    return authService.refreshToken()
      .pipe(mergeMap(() => addAuthorizationHeader(req, next, authService.getToken())))
  }

  inject(Router).navigateByUrl('/action/logout').then();
  return EMPTY;
};

function isPublicRoute(url: string): boolean {
  return !url.startsWith('http') || url.startsWith(ConfigService.config.baseApiUrl + '/public');
}

function addAuthorizationHeader(req: HttpRequest<unknown>, next: HttpHandlerFn, jwt: string): Observable<HttpEvent<unknown>> {
  const clonedReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${jwt}`)
  });

  return next(clonedReq);
}
