import { Component } from '@angular/core';
import {BaseCollectionComponent} from "../../../base-collection.component";
import {LeaderboardResponse} from "../../../common/models/resonse/leaderboard/leaderboard-response";
import {PaginatedCollection} from "../../../common/models/util/paginated-collection";
import {Observable, take, takeUntil} from "rxjs";
import {LeaderboardService} from "../../../common/services/leaderboard.service";
import {DatePipe, LowerCasePipe} from "@angular/common";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {PaginationComponent} from "../../../common/components/pagination/pagination.component";
import {SearchInputComponent} from "../../../common/components/search-input/search-input.component";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {FlashMessageComponent} from "../../../common/components/flash-message/flash-message.component";
import {ConfirmModalConfig} from "../../../common/models/modal-config/confirm-modal-config";
import {ModalService} from "../../../common/services/modal.service";

@Component({
  selector: 'app-leader-boards-list',
  standalone: true,
  imports: [
    DatePipe,
    MessageDisplayComponent,
    PaginationComponent,
    SearchInputComponent,
    TranslateModule,
    LowerCasePipe,
    RouterLink,
    FlashMessageComponent
  ],
  templateUrl: './leader-boards-list.component.html',
  styleUrl: './leader-boards-list.component.scss'
})
export class LeaderBoardsListComponent extends BaseCollectionComponent<LeaderboardResponse> {

  constructor(
    private leaderboardService: LeaderboardService,
    private modalService: ModalService,
  ) {
    super();
  }

  askForDeletion(leaderboard: LeaderboardResponse): void {
    const config: ConfirmModalConfig = {
      titleKey: 'COMPONENTS.LEADERBOARDS.DELETE.title',
      bodyKey: 'COMPONENTS.LEADERBOARDS.DELETE.body',
      bodyValues: {name: leaderboard.name},
      okBtnKey: 'COMPONENTS.LEADERBOARDS.DELETE.ok',
      cancelBtnKey: 'COMMON.cancel'
    };

    this.modalService.showConfirmModal(config)
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.deleteLeaderboard(leaderboard);
        }
      });
  }

  protected fetch(): Observable<PaginatedCollection<LeaderboardResponse>> {
    return this.leaderboardService.getLeaderboards(this.currentPage, this.pageSize, this.searchString);
  }

  private deleteLeaderboard(leaderboard: LeaderboardResponse): void {
    this.leaderboardService.deleteLeaderboard(leaderboard)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.deleteSuccess(leaderboard.id, 'COMPONENTS.LEADERBOARDS.DELETE.success'),
        error: error => this.handleError(error)
      });
  }

}
