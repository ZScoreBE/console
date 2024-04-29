import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {
  addUpdateLeaderboardValidationMessages,
  addUpdateLeaderboardValidationMessageValues
} from "./add-update-leaderboard.form.validation";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {LeaderboardService} from "../../../common/services/leaderboard.service";
import {LeaderboardResponse} from "../../../common/models/resonse/leaderboard/leaderboard-response";
import {debounceTime, Observable, of, takeUntil} from "rxjs";
import {SortDirection} from "../../../common/models/util/sort-direction";
import {LeaderboardScoreType} from "../../../common/models/util/leaderboard-score-type";
import {FlashMessageService} from "../../../common/services/flash-message.service";
import {FlashMessageType} from "../../../common/models/util/flash-message-type";
import {TranslateModule} from "@ngx-translate/core";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {addInviteValidationMessageValues} from "../../organizations/manage-users/add-invite/add-invite.form.validation";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-add-update-leaderboard',
  standalone: true,
  imports: [
    TranslateModule,
    MessageDisplayComponent,
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './add-update-leaderboard.component.html',
  styleUrl: './add-update-leaderboard.component.scss'
})
export class AddUpdateLeaderboardComponent extends BaseComponent implements OnInit {

  readonly validationMessages = addUpdateLeaderboardValidationMessages;
  readonly validationMessagesValues = addUpdateLeaderboardValidationMessageValues;
  readonly LeaderboardScoreType = LeaderboardScoreType;

  formErrors: any = {
    name: '',
    direction: '',
    scoreType: ''
  };

  form: FormGroup;
  isUpdate: boolean = false;
  leaderboard: LeaderboardResponse | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private leaderboardService: LeaderboardService,
    private flashMessageService: FlashMessageService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.handleRouteParams()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: leaderboard => this.buildForm(leaderboard),
        error: error => this.handleError(error)
      });
  }

  get currentScoreType(): LeaderboardScoreType {
    return this.form.get('scoreType').value as LeaderboardScoreType;
  }

  submit(): void {
    if (this.form.invalid) return;

    const obs$ = this.isUpdate ?
      this.leaderboardService.updateLeaderboard(this.leaderboard!, this.form.value) :
      this.leaderboardService.createLeaderboard(this.form.value);

    obs$.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: () => this.handleSuccess(),
      error: err => this.handleError(err)
    });
  }

  selectScoreType(type: LeaderboardScoreType): void {
    this.form.get('scoreType').setValue(type);
  }

  private handleRouteParams(): Observable<LeaderboardResponse | null> {
    if (!this.route.snapshot.params['id']) {
      return of(null);
    }

    return this.leaderboardService.getLeaderboard(this.route.snapshot.params['id']);
  }

  private buildForm(leaderboard: LeaderboardResponse | null): void {
    this.leaderboard = leaderboard;
    this.isUpdate = this.leaderboard != null;

    this.form = this.fb.group({
      name: new FormControl(this.leaderboard?.name ?? '', [Validators.required, Validators.maxLength(this.validationMessagesValues.name.maxlength)]),
      direction: new FormControl(this.leaderboard?.direction ?? SortDirection.ASC, [Validators.required]),
      scoreType: new FormControl(this.leaderboard?.scoreType ?? LeaderboardScoreType.HIGHEST, [Validators.required]),
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
      this.isUpdate ? 'COMPONENTS.LEADERBOARDS.UPDATE.success' : 'COMPONENTS.LEADERBOARDS.ADD.success'
    );

    this.router.navigateByUrl(`/leaderboards`).then();
  }
}
