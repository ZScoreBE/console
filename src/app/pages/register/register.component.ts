import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BaseComponent} from "../../base.component";
import {registerValidationMessages, registerValidationMessageValues} from "./register.form.validation";
import {debounceTime, Observable, of, takeUntil} from "rxjs";
import {
  PasswordStrengthMeterComponent
} from "../../common/components/password-strength-meter/password-strength-meter.component";
import {FlashMessageService} from "../../common/services/flash-message.service";
import {UserService} from "../../common/services/user.service";
import {FlashMessageType} from "../../common/models/util/flash-message-type";
import {MessageDisplayComponent} from "../../common/components/message-display/message-display.component";
import {UserInviteResponse} from "../../common/models/resonse/user/user-invite-response";
import {UserInviteService} from "../../common/services/user-invite.service";
import {ConfigService} from "../../common/services/config.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    TranslateModule,
    ReactiveFormsModule,
    NgClass,
    PasswordStrengthMeterComponent,
    MessageDisplayComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends BaseComponent implements OnInit {

  private static readonly MIN_PASSWORD_STRENGTH: number = 2;

  formErrors: any = {
    name: '',
    email: '',
    organizationName: '',
    password: '',
    repeatPassword: ''
  };
  readonly validationMessages = registerValidationMessages;
  readonly validationMessageValues = registerValidationMessageValues;
  readonly termsUrl: string = ConfigService.config.termsUrl;

  form: FormGroup;
  currentPassword: string = '';
  invite: UserInviteResponse;
  inviteCode: string;

  private currentStrength = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private userInviteService: UserInviteService,
    private flashMessageService: FlashMessageService,
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.inviteCode = this.route.snapshot.queryParams['inviteCode'];

    this.loadInvite()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: invite => this.buildForm(invite),
        error: error => this.handleError(error),
      });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.userService.registerUser(this.form.getRawValue(), this.inviteCode)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.handleSuccess(),
        error: error => this.handleError(error)
      });
  }

  handlePasswordStrengthChange(strength: number): void {
    this.currentStrength = strength;
    this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages);
    this.cdr.detectChanges();
  }

  protected override onFormValueChanged(form: AbstractControl, formErrors: any, validationMessages: any): any {
    const errors = super.onFormValueChanged(form, formErrors, validationMessages);
    const password = this.form.get('password').value;
    const repeatPassword = this.form.get('repeatPassword').value;
    this.currentPassword = password;

    if (!errors.password && this.form.get('password').dirty && this.currentStrength < RegisterComponent.MIN_PASSWORD_STRENGTH) {
      errors.password = this.validationMessages.password.notStrongEnough;
    }

    if (!errors.repeatPassword && this.form.get('repeatPassword').dirty &&
      password !== '' && repeatPassword !== '' && password !== repeatPassword) {
      errors.repeatPassword = this.validationMessages.repeatPassword.notMatching;
    }

    return errors;
  }

  private buildForm(invite: UserInviteResponse): void {
    this.invite = invite;

    this.form = this.fb.group({
      name: new FormControl(this.invite ? this.invite.name : '', [Validators.required, Validators.maxLength(this.validationMessageValues.name.maxlength)]),
      email: new FormControl(this.invite ? this.invite.email : '', [Validators.required, Validators.email, Validators.maxLength(this.validationMessageValues.email.maxlength)]),
      organizationName: new FormControl('', this.invite ? [] : [Validators.required, Validators.maxLength(this.validationMessageValues.organizationName.maxlength)]),
      password: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl('', [Validators.required]),
      terms: new FormControl(false, [Validators.requiredTrue])
    });

    if (this.invite) {
      this.form.get('email').disable();
    }

    this.form.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(data => this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages));

    this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages);
  }

  private handleSuccess(): void {
    this.flashMessageService.setMessage(FlashMessageType.SUCCESS, 'COMPONENTS.REGISTER.success');
    this.router.navigateByUrl('/sign-in').then();
  }

  private loadInvite():Observable<UserInviteResponse | null> {
    if (!this.inviteCode) {
      return of(null);
    }

    return this.userInviteService.getInvite(this.inviteCode);
  }
}
