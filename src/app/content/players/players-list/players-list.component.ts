import {Component} from '@angular/core';
import {BaseCollectionComponent} from "../../../base-collection.component";
import {PlayerResponse} from "../../../common/models/resonse/player/player-response";
import {Observable, take, takeUntil} from "rxjs";
import {PaginatedCollection} from "../../../common/models/util/paginated-collection";
import {PlayerService} from "../../../common/services/player.service";
import {TranslateModule} from "@ngx-translate/core";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {PaginationComponent} from "../../../common/components/pagination/pagination.component";
import {SearchInputComponent} from "../../../common/components/search-input/search-input.component";
import {RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {ConfirmModalConfig} from "../../../common/models/modal-config/confirm-modal-config";
import {ModalService} from "../../../common/services/modal.service";
import {LeaderboardResponse} from "../../../common/models/resonse/leaderboard/leaderboard-response";

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [
    TranslateModule,
    MessageDisplayComponent,
    PaginationComponent,
    SearchInputComponent,
    RouterLink,
    DatePipe
  ],
  templateUrl: './players-list.component.html',
  styleUrl: './players-list.component.scss'
})
export class PlayersListComponent extends BaseCollectionComponent<PlayerResponse>{

  constructor(
    private playerService: PlayerService,
    private modalService: ModalService,
  ) {
    super();
  }

  askDeletePlayer(player: PlayerResponse): void {
    const config: ConfirmModalConfig = {
      titleKey: 'COMPONENTS.PLAYERS.DELETE.title',
      bodyKey: 'COMPONENTS.PLAYERS.DELETE.body',
      bodyValues: {name: player.name},
      okBtnKey: 'COMPONENTS.PLAYERS.DELETE.ok',
      cancelBtnKey: 'COMMON.cancel'
    };

    this.modalService.showConfirmModal(config)
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.deletePlayer(player);
        }
      });
  }

  protected fetch(): Observable<PaginatedCollection<PlayerResponse>> {
    return this.playerService.getPlayers(this.currentPage, this.pageSize, this.searchString);
  }

  private deletePlayer(player: PlayerResponse): void {
    this.playerService.deletePlayer(player)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.deleteSuccess(player.id, 'COMPONENTS.PLAYERS.DELETE.success'),
        error: error => this.handleError(error)
      });
  }

}
