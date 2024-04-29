import {Injectable} from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {SelectGameModalConfig} from "../models/modal-config/select-game-modal-config";
import {Observable, take} from "rxjs";
import {SelectGameModalComponent} from "../modals/select-game-modal/select-game-modal.component";
import {ConfirmModalConfig} from "../models/modal-config/confirm-modal-config";
import {ConfirmModalComponent} from "../modals/confirm-modal/confirm-modal.component";

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor(
    private bsModalService: BsModalService
  ) {
  }

  showConfirmModal(config: ConfirmModalConfig,
                   ignoreBackdropClick: boolean = true, showBackdrop: boolean = true, ignoreKeyboard: boolean = true): Observable<boolean> {
    const modalOptions: ModalOptions = {
      ignoreBackdropClick,
      backdrop: showBackdrop,
      keyboard: !ignoreKeyboard,
      initialState: {
        // @ts-ignore
        config
      }
    };

    const modalRef: BsModalRef = this.bsModalService.show(ConfirmModalComponent, modalOptions);
    return modalRef.content.confirmed.pipe(take(1));
  }

  showSelectGameModal(config: SelectGameModalConfig): Observable<boolean> {
    const modalOpts: ModalOptions = {
      ignoreBackdropClick: config.selectedGameId === null,
      keyboard: config.selectedGameId !== null,
      initialState: {
        config
      }
    };

    const modalRef: BsModalRef = this.bsModalService.show(SelectGameModalComponent, modalOpts);
    return modalRef.content.selected.pipe(take(1));
  }
}
