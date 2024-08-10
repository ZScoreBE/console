import { Injectable } from '@angular/core';
import {GameService} from "./game.service";
import {RestService} from "./rest.service";
import {map, Observable} from "rxjs";
import {PaginatedCollection} from "../models/util/paginated-collection";
import {LeaderboardResponse} from "../models/resonse/leaderboard/leaderboard-response";
import {catchSomethingWrong} from "../utils/functions";
import {CurrencyResponse} from "../models/resonse/currency/currency-response";
import {LeaderboardRequest} from "../models/request/leaderboard/leaderboard-request";
import {CurrencyRequest} from "../models/request/currency/currency-request";

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(
    private gameService: GameService,
    private restService: RestService
  ) { }

  getCurrencies(page: number, pageSize: number, search: string): Observable<PaginatedCollection<CurrencyResponse>> {
    let uri = `/games/${this.gameService.selectedGameId}/currencies?page=${page}&size=${pageSize}`;

    if (search && search !== '') {
      uri += `&search=${search}`;
    }

    return this.restService.get<PaginatedCollection<CurrencyResponse>>(uri)
      .pipe(catchSomethingWrong());
  }

  getCurrency(id: string): Observable<CurrencyResponse> {
    return this.restService.get<CurrencyResponse>(`/games/${this.gameService.selectedGameId}/currencies/${id}`)
      .pipe(catchSomethingWrong());
  }

  createCurrency(formData: any): Observable<CurrencyResponse> {
    const body = this.createCurrencyBody(formData);
    return this.restService.post<CurrencyResponse>(`/games/${this.gameService.selectedGameId}/currencies`, body)
      .pipe(catchSomethingWrong());
  }

  updateCurrency(id: string, formData: any): Observable<CurrencyResponse> {
    const body = this.createCurrencyBody(formData);
    return this.restService.put<CurrencyResponse>(`/games/${this.gameService.selectedGameId}/currencies/${id}`, body)
      .pipe(catchSomethingWrong());
  }

  deleteCurrency(id: string): Observable<boolean> {
    return this.restService.delete(`/games/${this.gameService.selectedGameId}/currencies/${id}`)
      .pipe(
        map(() => true),
        catchSomethingWrong()
      );
  }

  private createCurrencyBody(formData: any): CurrencyRequest {
    return {
      name: formData.name,
      key: formData.key,
    };
  }
}
