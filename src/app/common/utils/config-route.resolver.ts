import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import {first, map, Observable, tap} from "rxjs";
import {inject} from "@angular/core";
import {ConfigService} from "../services/config.service";

export const configRouteResolver: ResolveFn<boolean> =
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
    const configService: ConfigService = inject(ConfigService);

    return configService.config$.pipe(
      first(config => config.isServed),
      tap(() => console.log('Config loaded!')),
      map(config => config.isServed)
    );
  };
