import {Injectable} from '@angular/core';
import {GameService} from "./game.service";
import {RestService} from "./rest.service";
import {map, Observable} from "rxjs";
import {PaginatedCollection} from "../models/util/paginated-collection";
import {CurrencyOfferResponse} from "../models/resonse/currency/currency-offer-response";
import {catchSomethingWrong} from "../utils/functions";
import {CurrencyOfferRequest} from "../models/request/currency/currency-offer-request";

@Injectable({
  providedIn: 'root'
})
export class CurrencyOfferService {

  constructor(
    private gameService: GameService,
    private restService: RestService
  ) { }

  getCurrencyOffers(currencyId: string, page: number, pageSize: number, search: string):
    Observable<PaginatedCollection<CurrencyOfferResponse>> {
    let uri = `/games/${this.gameService.selectedGameId}/currencies/${currencyId}/offers?page=${page}&size=${pageSize}`;

    if (search && search !== '') {
      uri += `&search=${search}`;
    }

    return this.restService.get<PaginatedCollection<CurrencyOfferResponse>>(uri)
      .pipe(catchSomethingWrong());
  }

  getCurrencyOffer(currencyId: string, id: string): Observable<CurrencyOfferResponse> {
    return this.restService.get<CurrencyOfferResponse>(`/games/${this.gameService.selectedGameId}/currencies/${currencyId}/offers/${id}`)
      .pipe(catchSomethingWrong());
  }

  createCurrencyOffer(currencyId: string, formData: any): Observable<CurrencyOfferResponse> {
    const body = this.createCurrencyOfferBody(formData);
    return this.restService.post<CurrencyOfferResponse>(`/games/${this.gameService.selectedGameId}/currencies/${currencyId}/offers`, body)
      .pipe(catchSomethingWrong());
  }

  updateCurrencyOffer(currencyId: string, id: string, formData: any): Observable<CurrencyOfferResponse> {
    const body = this.createCurrencyOfferBody(formData);
    return this.restService.put<CurrencyOfferResponse>(`/games/${this.gameService.selectedGameId}/currencies/${currencyId}/offers/${id}`, body)
      .pipe(catchSomethingWrong());
  }

  deleteCurrencyOffer(currencyId: string, id: string): Observable<boolean> {
    return this.restService.delete(`/games/${this.gameService.selectedGameId}/currencies/${currencyId}/offers/${id}`)
      .pipe(
        map(() => true),
        catchSomethingWrong()
      );
  }

  private createCurrencyOfferBody(formData: any): CurrencyOfferRequest {
    return {
      name: formData.name,
      key: formData.key,
      amount: formData.amount,
      priceEx: formData.priceEx,
      discountPriceEx: formData.discountPriceEx
    };
  }
}
