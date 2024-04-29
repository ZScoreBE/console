import {Injectable} from '@angular/core';
import {RestService} from "./rest.service";
import {map, Observable} from "rxjs";
import {BoolResult} from "../models/request/common/bool-result";
import {boolToString, catchSomethingWrong, stringToBool} from "../utils/functions";
import {GameResponse} from "../models/resonse/game/game-response";
import {GameRequest} from "../models/request/game/game-request";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private static readonly SELECTED_GAME_ID_LS_KEY: string = "selectedGame";
  private static readonly SELECTED_GAME_SANDBOX_LS_KEY: string = "selectedGameSandbox";

  constructor(
    private restService: RestService,
  ) { }

  createGame(formData: GameRequest): Observable<GameResponse> {
    return this.restService.post<GameResponse>(`/games`, formData)
      .pipe(catchSomethingWrong());
  }

  hasGames(): Observable<boolean> {
    return this.restService.get<BoolResult>(`/games/has-games`)
      .pipe(
        map(result => result.result),
        catchSomethingWrong()
      );
  }

  getAllGames(): Observable<GameResponse[]> {
    return this.restService.get<GameResponse[]>(`/games`)
      .pipe(
        catchSomethingWrong()
      );
  }

  updateSelectedGame(game: GameResponse): void {
    localStorage.setItem(GameService.SELECTED_GAME_ID_LS_KEY, game.id);
    localStorage.setItem(GameService.SELECTED_GAME_SANDBOX_LS_KEY, boolToString(game.sandboxMode));
  }

  getSelectedGame(): Observable<GameResponse> {
    return this.restService.get<GameResponse>(`/games/${this.selectedGameId}`)
      .pipe(catchSomethingWrong());
  }

  updateGeneralSettings(formData: any): Observable<GameResponse> {
    const body: GameRequest = {
      name: formData.name,
      engine: formData.engine
    };

    return this.restService.put<GameResponse>(`/games/${this.selectedGameId}`, body)
      .pipe(catchSomethingWrong());
  }

  regenerateApiKey(): Observable<GameResponse>  {
    return this.restService.patch<GameResponse>(`/games/${this.selectedGameId}/regenerate-api-key`, {})
      .pipe(catchSomethingWrong());
  }

  get selectedGameId(): string|null {
    return localStorage.getItem(GameService.SELECTED_GAME_ID_LS_KEY);
  }

  get isSandbox(): boolean {
    return stringToBool(localStorage.getItem(GameService.SELECTED_GAME_SANDBOX_LS_KEY));
  }
}
