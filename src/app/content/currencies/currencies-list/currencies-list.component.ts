import {Component} from '@angular/core';
import {BaseCollectionComponent} from "../../../base-collection.component";
import {CurrencyResponse} from "../../../common/models/resonse/currency/currency-response";
import {CurrencyService} from "../../../common/services/currency.service";
import {ModalService} from "../../../common/services/modal.service";
import {Observable, take, takeUntil} from "rxjs";
import {PaginatedCollection} from "../../../common/models/util/paginated-collection";
import {ConfirmModalConfig} from "../../../common/models/modal-config/confirm-modal-config";
import {TranslateModule} from "@ngx-translate/core";
import {FlashMessageComponent} from "../../../common/components/flash-message/flash-message.component";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {SearchInputComponent} from "../../../common/components/search-input/search-input.component";
import {RouterLink} from "@angular/router";
import {PaginationComponent} from "../../../common/components/pagination/pagination.component";
import {LowerCasePipe} from "@angular/common";

@Component({
  selector: 'app-currencies-list',
  standalone: true,
  imports: [
    TranslateModule,
    FlashMessageComponent,
    MessageDisplayComponent,
    SearchInputComponent,
    RouterLink,
    PaginationComponent,
    LowerCasePipe
  ],
  templateUrl: './currencies-list.component.html',
  styleUrl: './currencies-list.component.scss'
})
export class CurrenciesListComponent extends BaseCollectionComponent<CurrencyResponse>{

  constructor(
    private currencyService: CurrencyService,
    private modalService: ModalService
  ) {
    super();
  }

  askForDeletion(currency: CurrencyResponse): void {
    const config: ConfirmModalConfig = {
      titleKey: 'COMPONENTS.CURRENCIES.DELETE.title',
      bodyKey: 'COMPONENTS.CURRENCIES.DELETE.body',
      bodyValues: {name: currency.name},
      okBtnKey: 'COMPONENTS.CURRENCIES.DELETE.ok',
      cancelBtnKey: 'COMMON.cancel'
    };

    this.modalService.showConfirmModal(config)
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.deleteCurrency(currency);
        }
      });
  }

  protected fetch(): Observable<PaginatedCollection<CurrencyResponse>> {
    return this.currencyService.getCurrencies(this.currentPage, this.pageSize, this.searchString);
  }


  private deleteCurrency(currency: CurrencyResponse): void {
    this.currencyService.deleteCurrency(currency.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.deleteSuccess(currency.id, 'COMPONENTS.CURRENCIES.DELETE.success'),
        error: error => this.handleError(error)
      });
  }
}
