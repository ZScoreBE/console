import {Injectable} from '@angular/core';
import {RestService} from "./rest.service";
import {GameService} from "./game.service";
import {map, Observable} from "rxjs";
import {PaginatedCollection} from "../models/util/paginated-collection";
import {catchSomethingWrong} from "../utils/functions";
import {TriggerResponse} from "../models/resonse/trigger/trigger-response";
import {TriggerRequest} from "../models/request/trigger/trigger-request";

@Injectable({
  providedIn: 'root'
})
export class TriggerService {

  constructor(
    private gameService: GameService,
    private restService: RestService
  ) {
  }

  getTriggers(page: number, pageSize: number, search: string): Observable<PaginatedCollection<TriggerResponse>> {
    let uri = `/games/${this.gameService.selectedGameId}/triggers?page=${page}&size=${pageSize}`;

    if (search && search !== '') {
      uri += `&search=${search}`;
    }

    return this.restService.get<PaginatedCollection<TriggerResponse>>(uri)
      .pipe(catchSomethingWrong());
  }

  getTrigger (id: string): Observable<TriggerResponse> {
    return this.restService.get<TriggerResponse>(`/games/${this.gameService.selectedGameId}/triggers/${id}`)
      .pipe(catchSomethingWrong());
  }

  createTrigger(formData: any): Observable<TriggerResponse> {
    const body = this.createTriggerBody(formData);
    return this.restService.post<TriggerResponse>(`/games/${this.gameService.selectedGameId}/triggers`, body)
      .pipe(catchSomethingWrong());
  }

  updateTrigger(id: string, formData: any): Observable<TriggerResponse> {
    const body = this.createTriggerBody(formData);
    return this.restService.put<TriggerResponse>(`/games/${this.gameService.selectedGameId}/triggers/${id}`, body)
      .pipe(catchSomethingWrong());
  }

  deleteTrigger(id: string): Observable<boolean> {
    return this.restService.delete(`/games/${this.gameService.selectedGameId}/triggers/${id}`)
      .pipe(
        map(() => true),
        catchSomethingWrong()
      );
  }

  private createTriggerBody(formData: any): TriggerRequest {
    const body: TriggerRequest = {
      name: formData.name,
      key: formData.key,
      costType: formData.costType,
      rewardType: formData.rewardType,
      costAmount: null,
      costCurrencyId: null,
      rewardAmount: null,
      rewardCurrencyId: null
    };

    if (formData.costAmount) {
      body.costAmount = formData.costAmount;
    }

    if (formData.costCurrencyId) {
      body.costCurrencyId = formData.costCurrencyId;
    }

    if (formData.rewardAmount) {
      body.rewardAmount = formData.rewardAmount;
    }

    if (formData.rewardCurrencyId) {
      body.rewardCurrencyId = formData.rewardCurrencyId;
    }

    return body;
  }
}
