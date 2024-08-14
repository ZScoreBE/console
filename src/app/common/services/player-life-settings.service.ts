import {Injectable} from '@angular/core';
import {RestService} from "./rest.service";
import {catchError, Observable, of, throwError} from "rxjs";
import {PlayerLifeSettingsResponse} from "../models/resonse/player/player-life-settings-response";
import {PlayerLifeSettingsRequest} from "../models/request/player/player-life-settings-request";
import {GameService} from "./game.service";
import {catchSomethingWrong} from "../utils/functions";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PlayerLifeSettingsService {

  constructor(
    private gameService: GameService,
    private restService: RestService
  ) {
  }

  public updatePlayerLifeSettings(formData: any): Observable<PlayerLifeSettingsResponse> {
    const body: PlayerLifeSettingsRequest = {
      enabled: formData.enabled,
      maxLives: formData.maxLives,
      giveLifeAfterSeconds: formData.giveLifeAfterSeconds || null
    };

    return this.restService.put<PlayerLifeSettingsResponse>(`/games/${this.gameService.selectedGameId}/player-life-settings`, body)
      .pipe(catchSomethingWrong());
  }

  /**
   * Returns null if the endpoint has a 404
   */
  public getPlayerLifeSettings(): Observable<PlayerLifeSettingsResponse | null> {
    return this.restService.get<PlayerLifeSettingsResponse>(`/games/${this.gameService.selectedGameId}/player-life-settings`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) return of(null);

          return throwError(() => 'ERRORS.somethingWentWrong');
        })
      );
  }
}
