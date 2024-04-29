import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {BaseCollectionComponent} from "../../../../base-collection.component";
import {UserInviteResponse} from "../../../../common/models/resonse/user/user-invite-response";
import {UserInviteService} from "../../../../common/services/user-invite.service";
import {Observable, take, takeUntil} from "rxjs";
import {PaginatedCollection} from "../../../../common/models/util/paginated-collection";
import {MessageDisplayComponent} from "../../../../common/components/message-display/message-display.component";
import {SearchInputComponent} from "../../../../common/components/search-input/search-input.component";
import {RouterLink} from "@angular/router";
import {LowerCasePipe} from "@angular/common";
import {PaginationComponent} from "../../../../common/components/pagination/pagination.component";
import {FlashMessageComponent} from "../../../../common/components/flash-message/flash-message.component";
import {ConfirmModalConfig} from "../../../../common/models/modal-config/confirm-modal-config";
import {ModalService} from "../../../../common/services/modal.service";

@Component({
  selector: 'app-invites-list',
  standalone: true,
  imports: [
    TranslateModule,
    MessageDisplayComponent,
    SearchInputComponent,
    RouterLink,
    LowerCasePipe,
    PaginationComponent,
    FlashMessageComponent
  ],
  templateUrl: './invites-list.component.html',
  styleUrl: './invites-list.component.scss'
})
export class InvitesListComponent extends BaseCollectionComponent<UserInviteResponse>{

  constructor(
    private userInviteService: UserInviteService,
    private modalService: ModalService,
  ) {
    super(false);
  }

  askDeleteInvite(inviteResponse: UserInviteResponse): void {
    const config: ConfirmModalConfig = {
      titleKey: 'COMPONENTS.USERS.MANAGE.INVITE-LIST.DELETE.title',
      bodyKey: 'COMPONENTS.USERS.MANAGE.INVITE-LIST.DELETE.body',
      bodyValues: {email: inviteResponse.email},
      okBtnKey: 'COMPONENTS.USERS.MANAGE.INVITE-LIST.DELETE.ok',
      cancelBtnKey: 'COMMON.cancel'
    };

    this.modalService.showConfirmModal(config)
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.deleteUserInvite(inviteResponse);
        }
      });
  }

  protected fetch(): Observable<PaginatedCollection<UserInviteResponse>> {
    return this.userInviteService.getPendingInvites(this.currentPage, this.pageSize, this.searchString);
  }

  private deleteUserInvite(invite: UserInviteResponse): void {
    this.userInviteService.deleteInvite(invite)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.deleteSuccess(invite.id, 'COMPONENTS.USERS.MANAGE.INVITE-LIST.DELETE.success'),
        error: error => this.handleError(error)
      });
  }
}
