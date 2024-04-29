import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {
  addUpdateAchievementValidationMessages,
  addUpdateAchievementValidationMessageValues
} from "./add-update-achievement.form.validation";
import {AchievementType} from "../../../common/models/util/achievement-type";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AchievementResponse} from "../../../common/models/resonse/achievement/achievement-response";
import {ActivatedRoute, Router} from "@angular/router";
import {AchievementService} from "../../../common/services/achievement.service";
import {FlashMessageService} from "../../../common/services/flash-message.service";
import {debounceTime, Observable, of, takeUntil} from "rxjs";
import {FlashMessageType} from "../../../common/models/util/flash-message-type";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-add-update-achievement',
  standalone: true,
  imports: [
    FormsModule,
    MessageDisplayComponent,
    ReactiveFormsModule,
    TranslateModule,
    NgClass
  ],
  templateUrl: './add-update-achievement.component.html',
  styleUrl: './add-update-achievement.component.scss'
})
export class AddUpdateAchievementComponent extends BaseComponent implements OnInit {

  readonly validationMessages = addUpdateAchievementValidationMessages;
  readonly validationMessageValues = addUpdateAchievementValidationMessageValues;
  readonly AchievementType = AchievementType;

  formErrors: any = {
    name: '',
    description: '',
    type: '',
    neededCount: ''
  };

  form: FormGroup;
  isUpdate: boolean = false;
  achievement: AchievementResponse|null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private achievementService: AchievementService,
    private flashMessageService: FlashMessageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.handleRouteParams()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: achievement => this.buildForm(achievement),
        error: error => this.handleError(error)
      });
  }

  get currentType(): AchievementType {
    return this.form.get('type').value as AchievementType;
  }

  submit(): void {
    if (this.form.invalid) return;

    const obs$ = this.isUpdate ?
      this.achievementService.updateAchievement(this.achievement!, this.form.value) :
      this.achievementService.createAchievement(this.form.value);

    obs$.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: () => this.handleSuccess(),
      error: err => this.handleError(err)
    });
  }

  selectType(type: AchievementType): void {
    this.form.get('type').setValue(type);
  }

  private handleRouteParams(): Observable<AchievementResponse|null> {
    if (!this.route.snapshot.params['id']) {
      return of(null);
    }

    return this.achievementService.getAchievement(this.route.snapshot.params['id']);
  }

  private buildForm(achievement: AchievementResponse|null): void {
    this.achievement = achievement;
    this.isUpdate = this.achievement != null;

    this.form = this.fb.group({
      name: new FormControl(this.achievement?.name ?? '', [Validators.required, Validators.maxLength(this.validationMessageValues.name.maxlength)]),
      description: new FormControl(this.achievement?.description ?? '', [Validators.required, Validators.maxLength(this.validationMessageValues.description.maxlength)]),
      type: new FormControl(this.achievement?.type ?? AchievementType.SINGLE, [Validators.required]),
      neededCount: new FormControl(this.achievement?.neededCount ?? null, [Validators.min(this.validationMessageValues.neededCount.maxlength)]),
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
      this.isUpdate ? 'COMPONENTS.ACHIEVEMENTS.UPDATE.success' : 'COMPONENTS.ACHIEVEMENTS.ADD.success'
    );

    this.router.navigateByUrl(`/achievements`).then();
  }
}
