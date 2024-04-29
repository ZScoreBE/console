import {Component, EventEmitter, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {ConfirmModalConfig} from "../../models/modal-config/confirm-modal-config";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss'
})
export class ConfirmModalComponent {

  @Output() confirmed: EventEmitter<boolean> = new EventEmitter<boolean>();

  config: ConfirmModalConfig;

  constructor(private bsModalRef: BsModalRef) {}

  ok(): void {
    this.confirmed.emit(true);
    this.bsModalRef.hide();
  }

  close(): void {
    this.confirmed.emit(false);
    this.bsModalRef.hide();
  }
}
