import {Component, EventEmitter, Output} from '@angular/core';
import {SelectGameModalConfig} from "../../models/modal-config/select-game-modal-config";
import {BsModalRef} from "ngx-bootstrap/modal";
import {GameService} from "../../services/game.service";
import {TranslateModule} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {GameResponse} from "../../models/resonse/game/game-response";

@Component({
  selector: 'app-select-game-modal',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './select-game-modal.component.html',
  styleUrl: './select-game-modal.component.scss'
})
export class SelectGameModalComponent {

  @Output() selected: EventEmitter<boolean> = new EventEmitter<boolean>();

  config: SelectGameModalConfig;

  constructor(
    private bsModalRef: BsModalRef,
    private gameService: GameService,
    private router: Router,
  ) {}

  selectGame(game: GameResponse): void {
    this.gameService.updateSelectedGame(game);
    this.selected.emit(true);
    this.bsModalRef.hide();
  }

  cancel(): void {
    this.selected.emit(false);
    this.bsModalRef.hide();
  }

  createNewGame() {
    this.router.navigateByUrl('/action/create-game').then();
    this.bsModalRef.hide();
  }
}
