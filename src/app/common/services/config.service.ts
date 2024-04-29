import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AppConfig, DEFAULT_APP_CONFIG} from "../models/util/app-config";

export function configFactory(config: ConfigService): () => Observable<boolean> {
  return () => config.loadAppConfig();
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private static readonly CONFIG_PATH: string = '/assets/config/config.json';

  private static _config: AppConfig;
  static get config(): AppConfig {
    return this._config;
  }

  public readonly config$: Observable<AppConfig>;

  private config = new BehaviorSubject<AppConfig>(DEFAULT_APP_CONFIG);

  constructor(
    private http: HttpClient
  ) {
    this.config$ = this.config.asObservable();
  }

  loadAppConfig(): Observable<boolean> {
    return this.http.get(ConfigService.CONFIG_PATH).pipe(
      map((response: any) => {
        this.createConfig(response);
        return true;
      }),
      catchError((error) =>  {
        this.createConfig(null, true);
        return of(false);
      })
    );
  }

  private createConfig(data: any, hasError: boolean = false): void {
    const config :AppConfig =  {
      baseApiUrl: data?.baseApiUrl ?? null,
      termsUrl: data?.termsUrl ?? null,
      isServed: true,
      error: hasError
    };

    ConfigService._config = config;
    this.config.next(config);
  }
}
