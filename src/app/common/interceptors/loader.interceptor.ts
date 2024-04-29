import {HttpInterceptorFn} from '@angular/common/http';
import {finalize} from "rxjs";
import {inject, Inject} from "@angular/core";
import {LoaderService} from "../services/loader.service";

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  if (req.headers.get('x-ignore-loader') !== 'true') {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};
