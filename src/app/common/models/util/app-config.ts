export interface AppConfig {
  baseApiUrl: string;
  termsUrl: string;
  error: boolean;
  isServed: boolean;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  isServed: false,
  error: false,
  baseApiUrl: null,
  termsUrl: '#'
}
