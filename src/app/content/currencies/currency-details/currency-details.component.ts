import {Component, OnInit} from '@angular/core';
import {BaseCollectionComponent} from "../../../base-collection.component";
import {CurrencyOfferResponse} from "../../../common/models/resonse/currency/currency-offer-response";
import {Observable, take, takeUntil} from "rxjs";
import {PaginatedCollection} from "../../../common/models/util/paginated-collection";
import {CurrencyResponse} from "../../../common/models/resonse/currency/currency-response";
import {CurrencyService} from "../../../common/services/currency.service";
import {CurrencyOfferService} from "../../../common/services/currency-offer.service";
import {TranslateModule} from "@ngx-translate/core";
import {FlashMessageComponent} from "../../../common/components/flash-message/flash-message.component";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {PaginationComponent} from "../../../common/components/pagination/pagination.component";
import {CurrencyPipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SearchInputComponent} from "../../../common/components/search-input/search-input.component";
import {ConfirmModalConfig} from "../../../common/models/modal-config/confirm-modal-config";
import {ModalService} from "../../../common/services/modal.service";
import {FlashMessageService} from "../../../common/services/flash-message.service";

@Component({
  selector: 'app-currency-details',
  standalone: true,
  imports: [
    TranslateModule,
    FlashMessageComponent,
    MessageDisplayComponent,
    PaginationComponent,
    CurrencyPipe,
    RouterLink,
    SearchInputComponent
  ],
  templateUrl: './currency-details.component.html',
  styleUrl: './currency-details.component.scss'
})
export class CurrencyDetailsComponent extends BaseCollectionComponent<CurrencyOfferResponse> implements OnInit {

  currency: CurrencyResponse;

  constructor(
    private currencyService: CurrencyService,
    private currencyOfferService: CurrencyOfferService,
    private modalService: ModalService,
    private flashMessageService: FlashMessageService,
  ) {
    super();
  }


  override ngOnInit() {
    const routeSnapshot = this.route.snapshot;

    if (!routeSnapshot.params['id']) {
      this.router.navigateByUrl(`/currencies`).then();
      return;
    }

    this.currencyService.getCurrency(routeSnapshot.params['id'])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: currency => {
          this.currency = currency;
          this.handleQueryParams(routeSnapshot.queryParams)
        },
        error: error => this.handleError(error)
      });
  }

  protected fetch(): Observable<PaginatedCollection<CurrencyOfferResponse>> {
    return this.currencyOfferService.getCurrencyOffers(this.currency.id, this.currentPage, this.pageSize, this.searchString);
  }

  askForDeletion(offer: CurrencyOfferResponse): void {
    const config: ConfirmModalConfig = {
      titleKey: 'COMPONENTS.CURRENCIES.OFFERS.DELETE.title',
      bodyKey: 'COMPONENTS.CURRENCIES.OFFERS.DELETE.body',
      bodyValues: {name: offer.name},
      okBtnKey: 'COMPONENTS.CURRENCIES.OFFERS.DELETE.ok',
      cancelBtnKey: 'COMMON.cancel'
    };

    this.modalService.showConfirmModal(config)
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.deleteCurrencyOffer(offer);
        }
      });
  }

  private deleteCurrencyOffer(offer: CurrencyOfferResponse): void {
    this.currencyOfferService.deleteCurrencyOffer(this.currency.id, offer.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.deleteSuccess(offer.id, 'COMPONENTS.CURRENCIES.OFFERS.DELETE.success'),
        error: error => this.handleError(error)
      });
  }
}
