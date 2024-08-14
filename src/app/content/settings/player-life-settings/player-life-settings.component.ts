import {Component, OnInit} from '@angular/core';
import {PlayerLifeSettingsResponse} from "../../../common/models/resonse/player/player-life-settings-response";
import {BaseComponent} from "../../../base.component";
import {PlayerLifeSettingsService} from "../../../common/services/player-life-settings.service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {debounceTime, takeUntil} from "rxjs";
import {
  playerLifeSettingsValidationMessages,
  playerLifeSettingsValidationMessagesValues
} from "./player-life-settings.form.validation";
import {TranslateModule} from "@ngx-translate/core";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-player-life-settings',
  standalone: true,
  imports: [
    TranslateModule,
    MessageDisplayComponent,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './player-life-settings.component.html',
  styleUrl: './player-life-settings.component.scss'
})
export class PlayerLifeSettingsComponent extends BaseComponent implements OnInit {

  readonly validationMessages = playerLifeSettingsValidationMessages;
  readonly validationMessagesValues = playerLifeSettingsValidationMessagesValues;

  formErrors: any = {
    maxLives: '',
    giveLifeAfterSeconds: '',
  };

  form: FormGroup;

  private settings: PlayerLifeSettingsResponse | null;

  constructor(
    private fb: FormBuilder,
    private playerLifeSettingsService: PlayerLifeSettingsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.playerLifeSettingsService.getPlayerLifeSettings()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: settings => this.buildForm(settings),
        error: error => this.handleError(error)
      });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.playerLifeSettingsService.updatePlayerLifeSettings(this.form.getRawValue())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: settings => this.handleSuccess(settings),
        error: err => this.handleError(err)
      });
  }

  get isEnabled(): boolean {
    return this.form?.get('enabled')?.value || false;
  }

  private buildForm(settings: PlayerLifeSettingsResponse | null): void {
    this.settings = settings;

    this.form = this.fb.group({
      enabled: new FormControl(settings?.enabled || false, []),
      maxLives: new FormControl({value: settings?.maxLives || 5, disabled: settings === null}, [Validators.required, Validators.min(this.validationMessagesValues.maxLives.min)]),
      giveLifeAfterSeconds: new FormControl({value: settings?.giveLifeAfterSeconds || null, disabled: settings === null}, [Validators.min(this.validationMessagesValues.giveLifeAfterSeconds.min)]),
    });

    this.form.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(data => this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages));

    this.form.get('enabled').valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (this.isEnabled) {
          this.form.get('maxLives').enable();
          this.form.get('giveLifeAfterSeconds').enable();
        } else {
          this.form.get('maxLives').disable();
          this.form.get('giveLifeAfterSeconds').disable();
        }
      });

    this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages);
  }

  private handleSuccess(settings: PlayerLifeSettingsResponse): void {
    this.resetMessages();
    this.setSuccessMessage('COMPONENTS.SETTINGS.PLAYER-LIFE.success');
    this.buildForm(settings);
  }
}
