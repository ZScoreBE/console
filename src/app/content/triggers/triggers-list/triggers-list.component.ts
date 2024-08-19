import {Component} from '@angular/core';
import {BaseCollectionComponent} from "../../../base-collection.component";
import {TriggerResponse} from "../../../common/models/resonse/trigger/trigger-response";
import {TriggerService} from "../../../common/services/trigger.service";
import {ModalService} from "../../../common/services/modal.service";
import {PaginatedCollection} from "../../../common/models/util/paginated-collection";
import {Observable, take, takeUntil} from "rxjs";
import {ConfirmModalConfig} from "../../../common/models/modal-config/confirm-modal-config";
import {TranslateModule} from "@ngx-translate/core";
import {FlashMessageComponent} from "../../../common/components/flash-message/flash-message.component";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {PaginationComponent} from "../../../common/components/pagination/pagination.component";
import {SearchInputComponent} from "../../../common/components/search-input/search-input.component";
import {RouterLink} from "@angular/router";
import {LowerCasePipe} from "@angular/common";

@Component({
  selector: 'app-triggers-list',
  standalone: true,
  imports: [
    TranslateModule,
    FlashMessageComponent,
    MessageDisplayComponent,
    PaginationComponent,
    SearchInputComponent,
    RouterLink,
    LowerCasePipe
  ],
  templateUrl: './triggers-list.component.html',
  styleUrl: './triggers-list.component.scss'
})
export class TriggersListComponent extends BaseCollectionComponent<TriggerResponse> {

  constructor(
    private triggerService: TriggerService,
    private modalService: ModalService,
  ) {
    super();
  }

  askForDeletion(trigger: TriggerResponse): void {
    const config: ConfirmModalConfig = {
      titleKey: 'COMPONENTS.TRIGGERS.DELETE.title',
      bodyKey: 'COMPONENTS.LEADERBOARDS.DELETE.body',
      bodyValues: {name: trigger.name},
      okBtnKey: 'COMPONENTS.TRIGGERS.DELETE.ok',
      cancelBtnKey: 'COMMON.cancel'
    };

    this.modalService.showConfirmModal(config)
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.deleteTrigger(trigger);
        }
      });
  }

  protected fetch(): Observable<PaginatedCollection<TriggerResponse>> {
    return this.triggerService.getTriggers(this.currentPage, this.pageSize, this.searchString);
  }

  private deleteTrigger(trigger: TriggerResponse): void {
    this.triggerService.deleteTrigger(trigger.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => this.deleteSuccess(trigger.id, 'COMPONENTS.TRIGGERS.DELETE.success'),
        error: error => this.handleError(error)
      });
  }
}
