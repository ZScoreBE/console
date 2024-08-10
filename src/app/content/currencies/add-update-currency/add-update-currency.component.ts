import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {
  addUpdateCurrencyValidationMessages,
  addUpdateCurrencyValidationMessageValues
} from "./add-update-currency.form.validation";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CurrencyResponse} from "../../../common/models/resonse/currency/currency-response";
import {ActivatedRoute, Router} from "@angular/router";
import {FlashMessageService} from "../../../common/services/flash-message.service";
import {CurrencyService} from "../../../common/services/currency.service";
import {debounceTime, Observable, of, takeUntil} from "rxjs";
import {FlashMessageType} from "../../../common/models/util/flash-message-type";
import {TranslateModule} from "@ngx-translate/core";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {JsonPipe, NgClass} from "@angular/common";

@Component({
  selector: 'app-add-update-currency',
  standalone: true,
  imports: [
    TranslateModule,
    MessageDisplayComponent,
    ReactiveFormsModule,
    NgClass,
    JsonPipe
  ],
  templateUrl: './add-update-currency.component.html',
  styleUrl: './add-update-currency.component.scss'
})
export class AddUpdateCurrencyComponent extends BaseComponent implements OnInit {

  readonly validationMessages = addUpdateCurrencyValidationMessages;
  readonly validationMessagesValues = addUpdateCurrencyValidationMessageValues;

  formErrors = {
    name: '',
    key: ''
  };

  form: FormGroup;
  isUpdate: boolean = false;
  currency: CurrencyResponse|null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessageService: FlashMessageService,
    private currencyService: CurrencyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.handleRouteParams()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: currency => this.buildForm(currency),
        error: error => this.handleError(error)
      });
  }

  submit(): void  {
    if (this.form.invalid) return;

    const obs$ = this.isUpdate ?
      this.currencyService.updateCurrency(this.currency!.id, this.form.value) :
      this.currencyService.createCurrency(this.form.value);

    obs$.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: () => this.handleSuccess(),
      error: error => this.handleError(error)
    });
  }

  private handleRouteParams(): Observable<CurrencyResponse|null> {
    if (!this.route.snapshot.params['id']) {
      return of(null);
    }

    return this.currencyService.getCurrency(this.route.snapshot.params['id']);
  }

  private buildForm(currency: CurrencyResponse|null): void {
    this.currency = currency;
    this.isUpdate = this.currency != null;

    this.form = this.fb.group({
      name: new FormControl(this.currency?.name ?? '', [Validators.required, Validators.maxLength(this.validationMessagesValues.name.maxlength)]),
      key: new FormControl(this.currency?.key ?? '', [Validators.required, Validators.maxLength(this.validationMessagesValues.key.maxlength)]),
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
      this.isUpdate ? 'COMPONENTS.CURRENCIES.UPDATE.success' : 'COMPONENTS.CURRENCIES.ADD.success'
    );

    this.router.navigateByUrl(`/currencies`).then();
  }
}
