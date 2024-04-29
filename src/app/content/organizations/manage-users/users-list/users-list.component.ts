import {Component} from '@angular/core';
import {BaseCollectionComponent} from "../../../../base-collection.component";
import {UserResponse} from "../../../../common/models/resonse/user/user-response";
import {PaginatedCollection} from "../../../../common/models/util/paginated-collection";
import {Observable, takeUntil} from "rxjs";
import {UserService} from "../../../../common/services/user.service";
import {TranslateModule} from "@ngx-translate/core";
import {SearchInputComponent} from "../../../../common/components/search-input/search-input.component";
import {RouterLink} from "@angular/router";
import {PaginationComponent} from "../../../../common/components/pagination/pagination.component";
import {MessageDisplayComponent} from "../../../../common/components/message-display/message-display.component";

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    TranslateModule,
    SearchInputComponent,
    RouterLink,
    PaginationComponent,
    MessageDisplayComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent extends BaseCollectionComponent<UserResponse> {

  constructor(
    private userService: UserService,
  ) {
    super(false);
  }

  resetPassword(user: UserResponse): void {
    this.userService.forgotPassword(user.email)
      .pipe(
        takeUntil(this.ngUnsubscribe)
      ).subscribe({
      next: () => this.setSuccessMessage('COMPONENTS.USERS.MANAGE.USER-LIST.resetPasswordSuccess'),
      error: error => this.handleError(error),
    });
  }

  protected fetch(): Observable<PaginatedCollection<UserResponse>> {
    return this.userService.getUsers(this.currentPage, this.pageSize, this.searchString);
  }
}
