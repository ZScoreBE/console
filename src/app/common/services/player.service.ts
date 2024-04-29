import {Injectable} from '@angular/core';
import {RestService} from "./rest.service";
import {GameService} from "./game.service";
import {map, Observable} from "rxjs";
import {PaginatedCollection} from "../models/util/paginated-collection";
import {PlayerResponse} from "../models/resonse/player/player-response";
import {CountResponse} from "../models/resonse/common/count-response";
import {catchSomethingWrong} from "../utils/functions";

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(
    private gameService: GameService,
    private restService: RestService
  ) {
  }

  getPlayers(page: number, pageSize: number, search: string): Observable<PaginatedCollection<PlayerResponse>> {
    let uri = `/games/${this.gameService.selectedGameId}/players?page=${page}&size=${pageSize}`;

    if (search && search !== '') {
      uri += `&search=${search}`;
    }

    return this.restService.get<PaginatedCollection<PlayerResponse>>(uri);
  }

  countPlayers(): Observable<number> {
    const uri = `/games/${this.gameService.selectedGameId}/players/count`;
    return this.restService.get<CountResponse>(uri)
      .pipe(
        catchSomethingWrong(),
        map(count => count.count)
      );
  }

  deletePlayer(player: PlayerResponse): Observable<boolean> {
    const uri = `/games/${this.gameService.selectedGameId}/players/${player.id}`;
    return this.restService.delete<CountResponse>(uri)
      .pipe(
        catchSomethingWrong(),
        map(() => true)
      );
  }
}
