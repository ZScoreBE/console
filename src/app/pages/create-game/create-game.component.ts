import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {Router, RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {GameService} from "../../common/services/game.service";
import {debounceTime, takeUntil} from "rxjs";
import {createFirstGameValidationMessages, createFirstGameValidationMessageValues} from "./create-game.form.validation";
import {MessageDisplayComponent} from "../../common/components/message-display/message-display.component";
import {NgClass, NgOptimizedImage} from "@angular/common";
import {
  PasswordStrengthMeterComponent
} from "../../common/components/password-strength-meter/password-strength-meter.component";
import {TranslateModule} from "@ngx-translate/core";
import {GameResponse} from "../../common/models/resonse/game/game-response";

@Component({
  selector: 'app-first-game',
  standalone: true,
  imports: [
    MessageDisplayComponent,
    NgOptimizedImage,
    PasswordStrengthMeterComponent,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    NgClass
  ],
  templateUrl: './create-game.component.html',
  styleUrl: './create-game.component.scss'
})
export class CreateGameComponent extends BaseComponent implements OnInit {

  readonly validationMessages = createFirstGameValidationMessages;
  readonly validationMessageValues = createFirstGameValidationMessageValues;
  formErrors: any = {
    name: '',
    engine: '',
  };

  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private gameService: GameService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  submit(): void {
    if (this.form.invalid) return;

    this.gameService.createGame(this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: game => this.handleSuccess(game),
        error: error => this.handleError(error)
      });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(this.validationMessageValues.name)]],
      engine: ['', [Validators.required]]
    });

    this.form.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(data => this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages));

    this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages);
  }

  private handleSuccess(game: GameResponse): void {
    this.gameService.updateSelectedGame(game);
    this.router.navigateByUrl('/').then();
  }

}
