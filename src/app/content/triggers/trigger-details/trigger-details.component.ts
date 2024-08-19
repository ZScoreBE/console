import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {ActivatedRoute, Router} from "@angular/router";
import {TriggerService} from "../../../common/services/trigger.service";
import {takeUntil} from "rxjs";
import {TriggerResponse} from "../../../common/models/resonse/trigger/trigger-response";
import {TranslateModule} from "@ngx-translate/core";
import {FlashMessageComponent} from "../../../common/components/flash-message/flash-message.component";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {TriggerCostType} from "../../../common/models/util/trigger-cost-type";
import {TriggerRewardType} from "../../../common/models/util/trigger-reward-type";
import {LowerCasePipe} from "@angular/common";

@Component({
  selector: 'app-trigger-details',
  standalone: true,
  imports: [
    TranslateModule,
    FlashMessageComponent,
    MessageDisplayComponent,
    LowerCasePipe
  ],
  templateUrl: './trigger-details.component.html',
  styleUrl: './trigger-details.component.scss'
})
export class TriggerDetailsComponent extends BaseComponent implements OnInit {

  readonly TriggerCostType = TriggerCostType;
  readonly TriggerRewardType = TriggerRewardType;

  trigger: TriggerResponse;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private triggerService: TriggerService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (!this.route.snapshot.params['id']) {
      this.router.navigateByUrl('/triggers').then();
      return;
    }

    this.triggerService.getTrigger(this.route.snapshot.params['id'])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: trigger => this.trigger = trigger,
        error: error => this.handleError(error)
      });
  }

}
