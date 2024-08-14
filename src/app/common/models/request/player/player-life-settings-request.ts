export interface PlayerLifeSettingsRequest {
  enabled: boolean;
  maxLives: number;
  giveLifeAfterSeconds: number|null;
}
