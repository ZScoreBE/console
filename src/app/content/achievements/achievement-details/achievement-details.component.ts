import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {AchievementService} from "../../../common/services/achievement.service";
import {AchievementResponse} from "../../../common/models/resonse/achievement/achievement-response";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntil} from "rxjs";
import {TranslateModule} from "@ngx-translate/core";
import {FlashMessageComponent} from "../../../common/components/flash-message/flash-message.component";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {LowerCasePipe} from "@angular/common";

@Component({
  selector: 'app-achievement-details',
  standalone: true,
  imports: [
    TranslateModule,
    FlashMessageComponent,
    MessageDisplayComponent,
    LowerCasePipe
  ],
  templateUrl: './achievement-details.component.html',
  styleUrl: './achievement-details.component.scss'
})
export class AchievementDetailsComponent extends BaseComponent implements OnInit {

  achievement: AchievementResponse;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private achievementService: AchievementService
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.route.snapshot.params['id']) {
      this.router.navigateByUrl('/achievements').then();
      return;
    }

    this.achievementService.getAchievement(this.route.snapshot.params['id'])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: achievement => this.achievement = achievement,
        error: error => this.handleError(error)
      });
  }

}
