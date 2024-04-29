import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient, provideHttpClient, withInterceptors} from "@angular/common/http";
import {configFactory, ConfigService} from "./common/services/config.service";
import {loaderInterceptor} from "./common/interceptors/loader.interceptor";
import {jwtAuthInterceptor} from "./common/interceptors/jwt-auth.interceptor";
import {ModalModule} from "ngx-bootstrap/modal";
import {provideAnimations} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";

export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([loaderInterceptor, jwtAuthInterceptor])
    ),
    provideAnimations(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        },
        defaultLanguage: 'en',
        useDefaultLang: true
      }),
      ModalModule.forRoot(),
      ToastrModule.forRoot(),
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      multi: true,
      deps: [ConfigService]
    },
  ]
};
