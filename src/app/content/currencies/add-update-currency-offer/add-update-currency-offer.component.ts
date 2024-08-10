import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {
  addUpdateCurrencyOfferValidationMessages,
  addUpdateCurrencyOfferValidationMessageValues
} from "./add-update-currency-offer.form.validation";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CurrencyOfferResponse} from "../../../common/models/resonse/currency/currency-offer-response";
import {ActivatedRoute, Router} from "@angular/router";
import {FlashMessageService} from "../../../common/services/flash-message.service";
import {CurrencyOfferService} from "../../../common/services/currency-offer.service";
import {debounceTime, Observable, of, takeUntil} from "rxjs";
import {TranslateModule} from "@ngx-translate/core";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {NgClass} from "@angular/common";
import {FlashMessageType} from "../../../common/models/util/flash-message-type";

@Component({
  selector: 'app-add-update-currency-offer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MessageDisplayComponent,
    FormsModule,
    NgClass
  ],
  templateUrl: './add-update-currency-offer.component.html',
  styleUrl: './add-update-currency-offer.component.scss'
})
export class AddUpdateCurrencyOfferComponent extends BaseComponent implements OnInit {

  readonly validationMessages = addUpdateCurrencyOfferValidationMessages;
  readonly validationMessagesValues = addUpdateCurrencyOfferValidationMessageValues;

  formErrors = {
    name: '',
    key: '',
    amount: '',
    priceEx: '',
    discountPriceEx: ''
  };

  form: FormGroup;
  isUpdate: boolean = false;
  currencyId: string;
  currencyOffer: CurrencyOfferResponse | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessageService: FlashMessageService,
    private currencyOfferService: CurrencyOfferService
  ) {
    super();
  }

  ngOnInit(): void {
    this.handleRouteParams()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: currencyOffer => this.buildForm(currencyOffer),
        error: error => this.handleError(error)
      });
  }

  submit(): void {
    if (this.form.invalid) return;

    const obs$ = this.isUpdate ?
      this.currencyOfferService.updateCurrencyOffer(this.currencyId, this.currencyOffer.id, this.form.value) :
      this.currencyOfferService.createCurrencyOffer(this.currencyId, this.form.value);

    obs$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.handleSuccess(),
        error: error => this.handleError(error)
      });
  }

  private handleRouteParams(): Observable<CurrencyOfferResponse | null> {
    this.currencyId = this.route.snapshot.params['currencyId'];

    if (!this.route.snapshot.params['id']) {
      return of(null);
    }

    return this.currencyOfferService.getCurrencyOffer(this.currencyId, this.route.snapshot.params['id']);
  }

  private buildForm(currencyOffer: CurrencyOfferResponse | null): void {
    this.currencyOffer = currencyOffer;
    this.isUpdate = this.currencyOffer != null;

    this.form = this.fb.group({
      name: new FormControl(this.currencyOffer?.name ?? '', [Validators.required, Validators.maxLength(this.validationMessagesValues.name.maxlength)]),
      key: new FormControl(this.currencyOffer?.key ?? '', [Validators.required, Validators.maxLength(this.validationMessagesValues.key.maxlength)]),
      amount: new FormControl(this.currencyOffer?.amount ?? '', [Validators.required, Validators.min(this.validationMessagesValues.amount.min)]),
      priceEx: new FormControl(this.currencyOffer?.priceEx.toFixed(2) ?? '', [Validators.required, Validators.min(this.validationMessagesValues.priceEx.min)]),
      discountPriceEx: new FormControl(this.currencyOffer?.discountPriceEx.toFixed(2) ?? '', [Validators.min(this.validationMessagesValues.priceEx.min)]),
    });


    this.form.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(data => this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages));

    this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages);
  }

  private handleSuccess(): void {
    this.flashMessageService.setMessage(
      FlashMessageType.SUCCESS,
      this.isUpdate ? 'COMPONENTS.CURRENCIES.OFFERS.UPDATE.success' : 'COMPONENTS.CURRENCIES.OFFERS.ADD.success'
    );

    this.router.navigateByUrl(`/currencies/${this.currencyId}`).then();
  }
}
