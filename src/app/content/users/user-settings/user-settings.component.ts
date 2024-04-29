import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {
  organizationSettingsValidationMessages,
  organizationSettingsValidationMessageValues
} from "../../organizations/organization-settings/organization-settings.form.validation";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../../common/services/user.service";
import {debounceTime, takeUntil} from "rxjs";
import {UserResponse} from "../../../common/models/resonse/user/user-response";
import {TranslateModule} from "@ngx-translate/core";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [
    TranslateModule,
    MessageDisplayComponent,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss'
})
export class UserSettingsComponent extends BaseComponent implements OnInit {

  readonly validationMessages = organizationSettingsValidationMessages;
  readonly validationMessageValues = organizationSettingsValidationMessageValues;

  formErrors: any = {
    name: ''
  };

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.userService.getMyself()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: user => this.buildForm(user),
        error: error => this.handleError(error)
      });
  }

  submitUpdate(): void {
    if (this.form.invalid) return;

    this.userService.updateMyself(this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: user => this.handleUpdateSuccess(user),
        error: error => this.handleError(error)
      });
  }

  private buildForm(user: UserResponse): void {
    this.form = this.fb.group({
      name: new FormControl(user.name, [Validators.required, Validators.maxLength(this.validationMessageValues.name.maxlength)]),
      email: new FormControl(user.email, []),
    });

    this.form.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(data => this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages));

    this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages);
  }

  private handleUpdateSuccess(user: UserResponse): void {
    this.setSuccessMessage('COMPONENTS.USERS.SETTINGS.updateSuccess');
    this.buildForm(user);
  }
}
