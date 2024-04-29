import { Component } from '@angular/core';
import {BaseCollectionComponent} from "../../../base-collection.component";
import {AchievementResponse} from "../../../common/models/resonse/achievement/achievement-response";
import {Observable, take, takeUntil} from "rxjs";
import {PaginatedCollection} from "../../../common/models/util/paginated-collection";
import {AchievementService} from "../../../common/services/achievement.service";
import {ModalService} from "../../../common/services/modal.service";
import {LeaderboardResponse} from "../../../common/models/resonse/leaderboard/leaderboard-response";
import {ConfirmModalConfig} from "../../../common/models/modal-config/confirm-modal-config";
import {FlashMessageComponent} from "../../../common/components/flash-message/flash-message.component";
import {LowerCasePipe} from "@angular/common";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {PaginationComponent} from "../../../common/components/pagination/pagination.component";
import {SearchInputComponent} from "../../../common/components/search-input/search-input.component";
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-achievements-list',
  standalone: true,
  imports: [
    FlashMessageComponent,
    LowerCasePipe,
    MessageDisplayComponent,
    PaginationComponent,
    SearchInputComponent,
    TranslateModule,
    RouterLink
  ],
  templateUrl: './achievements-list.component.html',
  styleUrl: './achievements-list.component.scss'
})
export class AchievementsListComponent extends BaseCollectionComponent<AchievementResponse>{

  constructor(
    private achievementService: AchievementService,
    private modalService: ModalService,
  ) {
    super();
  }

  askForDeletion(achievement: AchievementResponse): void {
    const config: ConfirmModalConfig = {
      titleKey: 'COMPONENTS.ACHIEVEMENTS.DELETE.title',
      bodyKey: 'COMPONENTS.ACHIEVEMENTS.DELETE.body',
      bodyValues: {name: achievement.name},
      okBtnKey: 'COMPONENTS.ACHIEVEMENTS.DELETE.ok',
      cancelBtnKey: 'COMMON.cancel'
    };

    this.modalService.showConfirmModal(config)
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.deleteAchievement(achievement);
        }
      });
  }

  protected fetch(): Observable<PaginatedCollection<AchievementResponse>> {
    return this.achievementService.getAchievements(this.currentPage, this.pageSize, this.searchString);
  }

  private deleteAchievement(achievement: AchievementResponse): void {
    this.achievementService.deleteAchievement(achievement)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.deleteSuccess(achievement.id, 'COMPONENTS.ACHIEVEMENTS.DELETE.success'),
        error: error => this.handleError(error)
      });
  }
}
