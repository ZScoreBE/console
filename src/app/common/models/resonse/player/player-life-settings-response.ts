export interface PlayerLifeSettingsResponse {
  id: string;
  enabled: boolean;
  maxLives: number;
  giveLifeAfterSeconds: number|null;
}
