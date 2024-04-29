import {Component, OnInit} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {FlashMessageComponent} from "../../common/components/flash-message/flash-message.component";
import {HasFlashMessageDirective} from "../../common/directives/has-flash-message.directive";
import {BaseComponent} from "../../base.component";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {AuthService} from "../../common/services/auth.service";
import {takeUntil} from "rxjs";
import {MessageDisplayComponent} from "../../common/components/message-display/message-display.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    FlashMessageComponent,
    HasFlashMessageDirective,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgClass,
    MessageDisplayComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit {

  form: FormGroup;

  private redirectUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.initRedirectUrl();
    this.buildForm();
  }

  submit(): void {
    if (this.form.invalid) return;

    this.authService.signIn(this.form.get('email').value, this.form.get('password').value)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.handleSuccess(),
        error: error => this.handleError(error)
      });
  }

  private initRedirectUrl(): void {
    const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');

    if (redirectUrl) {
      this.redirectUrl = atob(redirectUrl);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  private handleSuccess(): void {
    this.router.navigateByUrl(this.redirectUrl).then();
  }

}
