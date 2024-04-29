import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {GameService} from "../../../common/services/game.service";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {debounceTime, take, takeUntil} from "rxjs";
import {GameResponse} from "../../../common/models/resonse/game/game-response";
import {
  generalSettingsValidationMessages,
  generalSettingsValidationMessageValues
} from "./general-settings.form.validation";
import {TranslateModule} from "@ngx-translate/core";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {NgClass} from "@angular/common";
import {AlertModule} from "ngx-bootstrap/alert";
import {ConfirmModalConfig} from "../../../common/models/modal-config/confirm-modal-config";
import {ModalService} from "../../../common/services/modal.service";
import {GlobalEmitter} from "../../../common/utils/global-emitter";
import {GameNameChangedData} from "../../../common/models/util/emitter/game-name-changed-data";
import {GAME_NAME_CHANGED} from "../../../common/utils/defenitions";

@Component({
  selector: 'app-general-settings',
  standalone: true,
  imports: [
    TranslateModule,
    MessageDisplayComponent,
    ReactiveFormsModule,
    NgClass,
    AlertModule
  ],
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss'
})
export class GeneralSettingsComponent extends BaseComponent implements OnInit{

  readonly validationMessages = generalSettingsValidationMessages;
  readonly validationMessageValues = generalSettingsValidationMessageValues;

  formErrors: any = {
    name: '',
    engine: ''
  };

  form: FormGroup;
  apiKeyRevealed = false;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private modalService: ModalService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.gameService.getSelectedGame()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: game => this.buildForm(game),
        error: error => this.handleError(error)
      });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.gameService.updateGeneralSettings(this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: game => {
          this.handleSuccess(game, 'COMPONENTS.SETTINGS.GENERAL.success');
          GlobalEmitter.of<GameNameChangedData>(GAME_NAME_CHANGED).emit({id: game.id, name: game.name});
        },
        error: error => this.handleError(error)
      });
  }

  aksRegenerateApiKey(): void {
    const config: ConfirmModalConfig = {
      titleKey: 'COMPONENTS.SETTINGS.GENERAL.REGENERATE.title',
      bodyKey: 'COMPONENTS.SETTINGS.GENERAL.REGENERATE.body',
      bodyValues: {},
      okBtnKey: 'COMPONENTS.SETTINGS.GENERAL.REGENERATE.ok',
      cancelBtnKey: 'COMMON.cancel'
    };

    this.modalService.showConfirmModal(config)
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.regenerateApiKey();
        }
      });
  }

  toggleApiKey(): void {
    this.apiKeyRevealed = !this.apiKeyRevealed;
  }

  private buildForm(game: GameResponse): void {
    this.form = this.fb.group({
      name: new FormControl(game.name, [Validators.required, Validators.maxLength(this.validationMessageValues.name)]),
      engine: new FormControl(game.engine, [Validators.required]),
      apiKey: new FormControl(game.apiKey, [])
    });

    this.form.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(data => this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages));

    this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages);
  }

  private handleSuccess(game: GameResponse, msg: string): void {
    this.setSuccessMessage(msg);
    this.buildForm(game);
  }

  private regenerateApiKey(): void {
    this.gameService.regenerateApiKey()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: game => this.handleSuccess(game, 'COMPONENTS.SETTINGS.GENERAL.REGENERATE.success'),
        error: error => this.handleError(error)
      });
  }
}
