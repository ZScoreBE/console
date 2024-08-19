import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FlashMessageService} from "../../../common/services/flash-message.service";
import {TriggerService} from "../../../common/services/trigger.service";
import {debounceTime, forkJoin, Observable, of, takeUntil} from "rxjs";
import {TriggerResponse} from "../../../common/models/resonse/trigger/trigger-response";
import {
  addUpdateTriggerValidationMessages,
  addUpdateTriggerValidationMessageValues
} from "./add-update-trigger.form.validation";
import {TriggerCostType} from "../../../common/models/util/trigger-cost-type";
import {TriggerRewardType} from "../../../common/models/util/trigger-reward-type";
import {FlashMessageType} from "../../../common/models/util/flash-message-type";
import {CurrencyService} from "../../../common/services/currency.service";
import {CurrencyResponse} from "../../../common/models/resonse/currency/currency-response";
import {TranslateModule} from "@ngx-translate/core";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {
  addUpdateCurrencyValidationMessageValues
} from "../../currencies/add-update-currency/add-update-currency.form.validation";
import {NgClass} from "@angular/common";
import {
  playerLifeSettingsValidationMessagesValues
} from "../../settings/player-life-settings/player-life-settings.form.validation";

@Component({
  selector: 'app-add-update-trigger',
  standalone: true,
  imports: [
    TranslateModule,
    MessageDisplayComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './add-update-trigger.component.html',
  styleUrl: './add-update-trigger.component.scss'
})
export class AddUpdateTriggerComponent extends BaseComponent implements OnInit {

  readonly validationMessages = addUpdateTriggerValidationMessages;
  readonly validationMessagesValues = addUpdateTriggerValidationMessageValues;

  formErrors: any = {
    name: '',
    key: '',
    costType: '',
    rewardType: '',
    costAmount: '',
    costCurrencyId: '',
    rewardAmount: '',
    rewardCurrencyId: '',
  };

  form: FormGroup;
  isUpdate: boolean = false;
  currencies: CurrencyResponse[] = [];
  trigger: TriggerResponse | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private flashMessageService: FlashMessageService,
    private triggerService: TriggerService,
    private currencyService: CurrencyService
  ) {
    super();
  }

  ngOnInit(): void {
    this.handleRouteParams()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: data => this.buildForm(data),
        error: error => this.handleError(error)
      });
  }

  submit(): void {
    if (this.form.invalid) return;

    const obs$ = this.isUpdate ?
      this.triggerService.updateTrigger(this.trigger.id, this.form.value) :
      this.triggerService.createTrigger(this.form.value);

    obs$.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.handleSuccess(),
        error: err => this.handleError(err)
      });
  }

  private handleRouteParams(): Observable<[CurrencyResponse[], TriggerResponse|null]> {
    if (!this.route.snapshot.params['id']) {
      return forkJoin([this.currencyService.getAllCurrencies(), of(null)]);
    }

    return forkJoin([
      this.currencyService.getAllCurrencies(),
      this.triggerService.getTrigger(this.route.snapshot.params['id'])
    ]);
  }

  private buildForm(data: [CurrencyResponse[], TriggerResponse|null]) {
    this.currencies = data[0];
    this.trigger = data[1];
    this.isUpdate = this.trigger !== null;

    this.form = this.fb.group({
      name: new FormControl(this.trigger?.name ?? '', [Validators.required, Validators.maxLength(this.validationMessagesValues.name.maxlength)]),
      key: new FormControl(this.trigger?.key ?? '', [Validators.required, Validators.maxLength(this.validationMessagesValues.key.maxlength)]),
      costType: new FormControl(this.trigger?.costType ?? null, [Validators.required]),
      rewardType: new FormControl(this.trigger?.rewardType ?? null, [Validators.required]),
      costAmount: new FormControl({
        value: this.trigger?.costAmount ?? '',
        disabled: !this.trigger || this.trigger.costType === TriggerCostType.FREE
      }, [Validators.required, Validators.min(this.validationMessagesValues.costAmount.min)]),
      costCurrencyId: new FormControl({
        value: this.trigger?.costCurrency?.id ?? '',
        disabled: !this.trigger || this.trigger.costType === TriggerCostType.FREE
      }, [Validators.required]),
      rewardAmount: new FormControl({
        value: this.trigger?.rewardAmount ?? '',
        disabled: !this.trigger
      }, [Validators.required, Validators.min(this.validationMessagesValues.costAmount.min)]),
      rewardCurrencyId: new FormControl({
        value: this.trigger?.rewardCurrency?.id ?? '',
        disabled: !this.trigger || this.trigger.rewardType === TriggerRewardType.LIVES
      }, [Validators.required]),
    });

    this.form.get('costType').valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((type: TriggerCostType) => {
        console.log(type);
        if (type === TriggerCostType.CURRENCY) {
          this.form.get('costAmount').enable();
          this.form.get('costCurrencyId').enable();
        } else {
          this.form.get('costAmount').disable();
          this.form.get('costCurrencyId').disable();
        }
      });

    this.form.get('rewardType').valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((type: TriggerRewardType) => {
        if (type === TriggerRewardType.CURRENCY) {
          this.form.get('rewardAmount').enable();
          this.form.get('rewardCurrencyId').enable();
        } else if (type === TriggerRewardType.LIVES) {
          this.form.get('rewardAmount').enable();
          this.form.get('rewardCurrencyId').disable();
        } else {
          this.form.get('rewardAmount').disable();
          this.form.get('rewardCurrencyId').disable();
        }
      });

    this.form.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(() => this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages));

    this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages);
  }

  private handleSuccess(): void {
    this.flashMessageService.setMessage(
      FlashMessageType.SUCCESS,
      this.isUpdate ? 'COMPONENTS.TRIGGERS.UPDATE.success' : 'COMPONENTS.TRIGGERS.ADD.success'
    );

    this.router.navigateByUrl(`/triggers`).then();
  }
}
