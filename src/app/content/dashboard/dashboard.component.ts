import {Component, OnInit} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {BaseComponent} from "../../base.component";
import {PlayerService} from "../../common/services/player.service";
import {LeaderboardService} from "../../common/services/leaderboard.service";
import {AchievementService} from "../../common/services/achievement.service";
import {GameService} from "../../common/services/game.service";
import {forkJoin, takeUntil} from "rxjs";
import {FlashMessageComponent} from "../../common/components/flash-message/flash-message.component";
import {MessageDisplayComponent} from "../../common/components/message-display/message-display.component";
import {RouterLink} from "@angular/router";
import {GlobalEmitter} from "../../common/utils/global-emitter";
import {MODE_SWITCHED} from "../../common/utils/defenitions";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TranslateModule,
    FlashMessageComponent,
    MessageDisplayComponent,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent implements OnInit{

  players: number = 0;
  leaderboards: number = 0;
  achievements: number = 0;

  constructor(
    private playerService: PlayerService,
    private leaderboardService: LeaderboardService,
    private achievementService: AchievementService,
  ) {
    super();

    GlobalEmitter.of<boolean>(MODE_SWITCHED)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.ngOnInit());
  }

  ngOnInit(): void {
    const obs$ = [
      this.playerService.countPlayers(),
      this.leaderboardService.countLeaderboards(),
      this.achievementService.countAchievements()
    ];

    forkJoin(obs$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: data => this.initData(data as [number, number, number]),
        error: error => this.handleError(error)
      })
  }

  private initData(data: [number, number, number]): void {
    this.players = data[0];
    this.leaderboards = data[1];
    this.achievements = data[2];
  }


}
