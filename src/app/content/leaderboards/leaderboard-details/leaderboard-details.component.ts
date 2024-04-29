import {Component, OnInit} from '@angular/core';
import {LeaderboardService} from "../../../common/services/leaderboard.service";
import {BaseCollectionComponent} from "../../../base-collection.component";
import {LeaderboardScoreResponse} from "../../../common/models/resonse/leaderboard/leaderboard-score-response";
import {Observable, takeUntil} from "rxjs";
import {PaginatedCollection} from "../../../common/models/util/paginated-collection";
import {LeaderboardResponse} from "../../../common/models/resonse/leaderboard/leaderboard-response";
import {FlashMessageComponent} from "../../../common/components/flash-message/flash-message.component";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {TranslateModule} from "@ngx-translate/core";
import {LowerCasePipe} from "@angular/common";
import {PaginationComponent} from "../../../common/components/pagination/pagination.component";
import {SearchInputComponent} from "../../../common/components/search-input/search-input.component";

@Component({
  selector: 'app-leaderboard-details',
  standalone: true,
  imports: [
    FlashMessageComponent,
    MessageDisplayComponent,
    TranslateModule,
    LowerCasePipe,
    PaginationComponent,
    SearchInputComponent
  ],
  templateUrl: './leaderboard-details.component.html',
  styleUrl: './leaderboard-details.component.scss'
})
export class LeaderboardDetailsComponent extends BaseCollectionComponent<LeaderboardScoreResponse> implements OnInit {

  leaderboard: LeaderboardResponse;

  constructor(
    private leaderboardService: LeaderboardService
  ) {
    super();
  }

  override ngOnInit() {
    console.log('init');
    const routeSnapshot = this.route.snapshot;

    if (!routeSnapshot.params['id']) {
      this.router.navigateByUrl(`/leaderboards`).then();
      return;
    }

    this.leaderboardService.getLeaderboard(routeSnapshot.params['id'])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: leaderboard => {
          this.leaderboard = leaderboard;
          this.handleQueryParams(routeSnapshot.queryParams)
        },
        error: error => this.handleError(error)
      });
  }

  protected fetch(): Observable<PaginatedCollection<LeaderboardScoreResponse>> {
    return this.leaderboardService.getLeaderboardScores(this.leaderboard, this.currentPage, this.pageSize);
  }
}
