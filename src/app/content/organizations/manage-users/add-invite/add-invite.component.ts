import {Component, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {MessageDisplayComponent} from "../../../../common/components/message-display/message-display.component";
import {BaseComponent} from "../../../../base.component";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserInviteService} from "../../../../common/services/user-invite.service";
import {Router} from "@angular/router";
import {FlashMessageService} from "../../../../common/services/flash-message.service";
import {addInviteValidationMessages, addInviteValidationMessageValues} from "./add-invite.form.validation";
import {debounceTime, takeUntil} from "rxjs";
import {FlashMessageType} from "../../../../common/models/util/flash-message-type";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-add-invite',
  standalone: true,
  imports: [
    TranslateModule,
    MessageDisplayComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './add-invite.component.html',
  styleUrl: './add-invite.component.scss'
})
export class AddInviteComponent extends BaseComponent implements OnInit {

  readonly validationMessages = addInviteValidationMessages;
  readonly validationMessageValues = addInviteValidationMessageValues;

  formErrors: any = {
    name: '',
    email: '',
  };

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userInviteService: UserInviteService,
    private router: Router,
    private flashMessageService: FlashMessageService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  submit(): void {
    if (this.form.invalid) return;

    this.userInviteService.sendInvite(this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: invite => this.handleSuccess(),
        error: error => this.handleError(error),
      });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.maxLength(this.validationMessageValues.name.maxlength)]),
      email: new FormControl('', [Validators.required, Validators.maxLength(this.validationMessageValues.email.maxlength), Validators.email]),
    });

    this.form.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(data => this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages));

    this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages);
  }

  private handleSuccess(): void {
    this.flashMessageService.setMessage(FlashMessageType.SUCCESS, 'COMPONENTS.USERS.MANAGE.INVITE-LIST.ADD.success');
    this.router.navigateByUrl('/users').then();
  }
}
