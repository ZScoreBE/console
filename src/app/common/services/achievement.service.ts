import { Injectable } from '@angular/core';
import {GameService} from "./game.service";
import {RestService} from "./rest.service";
import {map, Observable} from "rxjs";
import {PaginatedCollection} from "../models/util/paginated-collection";
import {LeaderboardResponse} from "../models/resonse/leaderboard/leaderboard-response";
import {catchSomethingWrong} from "../utils/functions";
import {AchievementResponse} from "../models/resonse/achievement/achievement-response";
import {AchievementRequest} from "../models/request/achievement/achievement-request";
import {UpdateAchievementRequest} from "../models/request/achievement/update-achievement-request";
import {CountResponse} from "../models/resonse/common/count-response";

@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  constructor(
    private gameService: GameService,
    private restService: RestService
  ) { }

  getAchievements(page: number, pageSize: number, search: string): Observable<PaginatedCollection<AchievementResponse>> {
    let uri = `/games/${this.gameService.selectedGameId}/achievements?page=${page}&size=${pageSize}`;

    if (search && search !== '') {
      uri += `&search=${search}`;
    }

    return this.restService.get<PaginatedCollection<AchievementResponse>>(uri)
      .pipe(catchSomethingWrong());
  }

  countAchievements(): Observable<number> {
    const uri = `/games/${this.gameService.selectedGameId}/achievements/count`;
    return this.restService.get<CountResponse>(uri)
      .pipe(
        catchSomethingWrong(),
        map(count => count.count)
      );
  }

  deleteAchievement(achievement: AchievementResponse) : Observable<boolean>{
    return this.restService.delete(`/games/${this.gameService.selectedGameId}/achievements/${achievement.id}`)
      .pipe(
        map(() => true),
        catchSomethingWrong()
      );
  }

  getAchievement(id: string): Observable<AchievementResponse> {
    return this.restService.get<AchievementResponse>(`/games/${this.gameService.selectedGameId}/achievements/${id}`)
      .pipe(catchSomethingWrong());
  }

  createAchievement(formData: any): Observable<AchievementResponse> {
    const body: AchievementRequest = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      neededCount: formData.neededCount,
    };

    return this.restService.post<AchievementResponse>(`/games/${this.gameService.selectedGameId}/achievements`, body)
      .pipe(catchSomethingWrong());
  }

  updateAchievement(achievement: AchievementResponse, formData: any): Observable<AchievementResponse> {
    const body: UpdateAchievementRequest = {
      name: formData.name,
      description: formData.description,
      neededCount: formData.neededCount,
    };

    return this.restService.put<AchievementResponse>(`/games/${this.gameService.selectedGameId}/achievements/${achievement.id}`, body)
      .pipe(catchSomethingWrong());
  }
}
