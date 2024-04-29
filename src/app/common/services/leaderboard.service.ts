import {Injectable} from '@angular/core';
import {GameService} from "./game.service";
import {RestService} from "./rest.service";
import {map, Observable} from "rxjs";
import {PaginatedCollection} from "../models/util/paginated-collection";
import {LeaderboardResponse} from "../models/resonse/leaderboard/leaderboard-response";
import {LeaderboardRequest} from "../models/request/leaderboard/leaderboard-request";
import {catchSomethingWrong} from "../utils/functions";
import {LeaderboardScoreResponse} from "../models/resonse/leaderboard/leaderboard-score-response";
import {CountResponse} from "../models/resonse/common/count-response";

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(
    private gameService: GameService,
    private restService: RestService
  ) { }

  getLeaderboards(page: number, pageSize: number, search: string): Observable<PaginatedCollection<LeaderboardResponse>> {
    let uri = `/games/${this.gameService.selectedGameId}/leaderboards?page=${page}&size=${pageSize}`;

    if (search && search !== '') {
      uri += `&search=${search}`;
    }

    return this.restService.get<PaginatedCollection<LeaderboardResponse>>(uri)
      .pipe(catchSomethingWrong());
  }

  countLeaderboards(): Observable<number> {
    const uri = `/games/${this.gameService.selectedGameId}/leaderboards/count`;
    return this.restService.get<CountResponse>(uri)
      .pipe(
        catchSomethingWrong(),
        map(count => count.count)
      );
  }

  getLeaderboard(id: string): Observable<LeaderboardResponse> {
    return this.restService.get<LeaderboardResponse>(
      `/games/${this.gameService.selectedGameId}/leaderboards/${id}`
    ).pipe(catchSomethingWrong());
  }

  createLeaderboard(formData: any): Observable<any> {
    const body = this.createLeaderboardBody(formData);
    return this.restService.post<LeaderboardResponse>(
      `/games/${this.gameService.selectedGameId}/leaderboards`, body
    ).pipe(catchSomethingWrong());
  }

  updateLeaderboard(leaderboard: LeaderboardResponse, formData: any): Observable<any> {
    const body = this.createLeaderboardBody(formData);
    return this.restService.put<LeaderboardResponse>(
      `/games/${this.gameService.selectedGameId}/leaderboards/${leaderboard.id}`, body
    ).pipe(catchSomethingWrong());
  }

  deleteLeaderboard(leaderboard: LeaderboardResponse) : Observable<boolean>{
    return this.restService.delete(`/games/${this.gameService.selectedGameId}/leaderboards/${leaderboard.id}`)
      .pipe(
        map(() => true),
        catchSomethingWrong()
      );
  }

  getLeaderboardScores(leaderboard: LeaderboardResponse, page: number, pageSize: number): Observable<PaginatedCollection<LeaderboardScoreResponse>> {
    let uri = `/games/${this.gameService.selectedGameId}/leaderboards/${leaderboard.id}/scores?page=${page}&size=${pageSize}`;

    return this.restService.get<PaginatedCollection<LeaderboardScoreResponse>>(uri)
      .pipe(catchSomethingWrong());
  }

  private createLeaderboardBody(formData: any): LeaderboardRequest {
    return {
      name: formData.name,
      direction: formData.direction,
      scoreType: formData.scoreType
    };
  }
}
