import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../base.component";
import {ActivatedRoute, Router} from "@angular/router";
import {FlashMessageService} from "../../common/services/flash-message.service";
import {UserService} from "../../common/services/user.service";
import {take} from "rxjs";
import {FlashMessageType} from "../../common/models/util/flash-message-type";

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss'
})
export class ActivateComponent extends BaseComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flashMessageService: FlashMessageService,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    const code: string = this.route.snapshot.queryParamMap.get('code');

    if (!code) {
      this.router.navigateByUrl('/sign-up').then();
      return;
    }

    this.userService.activateUser(code)
      .pipe(take((1)))
      .subscribe({
        next: () => this.handleSuccess(),
        error: () => this.handleError(),
      });
  }

  protected override handleError(): void {
    this.flashMessageService.setMessage(FlashMessageType.DANGER, 'COMPONENTS.ACTIVATE.error');
    this.router.navigateByUrl('/sign-in').then();
  }

  private handleSuccess(): void {
    this.flashMessageService.setMessage(FlashMessageType.SUCCESS, 'COMPONENTS.ACTIVATE.success');
    this.router.navigateByUrl('/sign-in').then();
  }



}
