import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {
  organizationSettingsValidationMessages,
  organizationSettingsValidationMessageValues
} from "./organization-settings.form.validation";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {OrganizationService} from "../../../common/services/organization.service";
import {debounceTime, takeUntil} from "rxjs";
import {OrganizationResponse} from "../../../common/models/resonse/organization/organization-response";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-organization-settings',
  standalone: true,
  imports: [
    MessageDisplayComponent,
    ReactiveFormsModule,
    TranslateModule,
    NgClass
  ],
  templateUrl: './organization-settings.component.html',
  styleUrl: './organization-settings.component.scss'
})
export class OrganizationSettingsComponent extends BaseComponent implements OnInit {

  readonly validationMessages = organizationSettingsValidationMessages;
  readonly validationMessageValues = organizationSettingsValidationMessageValues;

  formErrors: any = {
    name: ''
  };

  form: FormGroup;

  private organization: OrganizationResponse;

  constructor(
    private fb: FormBuilder,
    private organizationService: OrganizationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.organizationService.getMyOrganization()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: organization => this.buildForm(organization),
        error: error => this.handleError(error)
      });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.organizationService.updateOrganization(this.form.value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: org => this.handleSuccess(org, 'COMPONENTS.ORGANIZATION.SETTINGS.updateSuccess'),
        error: error => this.handleError(error)
      });
  }

  private buildForm(organization: OrganizationResponse): void {
    this.organization = organization;

    this.form = this.fb.group({
      name: [this.organization.name, [Validators.required, Validators.maxLength(this.validationMessageValues.name.maxlength)]],
    });

    this.form.valueChanges.pipe(
      debounceTime(250),
      takeUntil(this.ngUnsubscribe)
    ).subscribe(data => this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages));

    this.formErrors = this.onFormValueChanged(this.form, this.formErrors, this.validationMessages);
  }

  private handleSuccess(organization: OrganizationResponse, msg: string): void {
    this.setSuccessMessage(msg);
    this.buildForm(organization);
  }
}
