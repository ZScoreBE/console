import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "../../../base.component";
import {GameService} from "../../../common/services/game.service";
import {GameResponse} from "../../../common/models/resonse/game/game-response";
import {take, takeUntil} from "rxjs";
import {ModalService} from "../../../common/services/modal.service";
import {GlobalEmitter} from "../../../common/utils/global-emitter";
import {GameNameChangedData} from "../../../common/models/util/emitter/game-name-changed-data";
import {GAME_NAME_CHANGED} from "../../../common/utils/defenitions";
import {Router} from "@angular/router";

@Component({
  selector: 'app-select-game-button',
  standalone: true,
  imports: [],
  templateUrl: './select-game-button.component.html',
  styleUrl: './select-game-button.component.scss'
})
export class SelectGameButtonComponent extends BaseComponent implements OnInit {

  selectedGame: GameResponse = null;
  games: GameResponse[] = [];

  private selectedGameId: string;

  constructor(
    private gameService: GameService,
    private modalService: ModalService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectedGameId = this.gameService.selectedGameId;

    this.gameService.getAllGames()
      .pipe(take(1))
      .subscribe(games => {
        this.games = games;
        if (this.selectedGameId) {
          this.updateSelectedGame();
        } else {
          this.showSelectGameDialog();
        }
      });

    GlobalEmitter.of<GameNameChangedData>(GAME_NAME_CHANGED)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        this.selectedGame.name = data.name;
        this.games[this.games.findIndex(game => game.id === data.id)].name = data.name;
      });
  }

  showSelectGameDialog(): void {
    const isSandbox = this.gameService.isSandbox;
    const availableGames = this.games.filter(game => game.sandboxMode === isSandbox);

    this.modalService.showSelectGameModal({games: availableGames, selectedGameId: this.selectedGameId})
      .pipe(take(1))
      .subscribe(result => {
        if (result) {
          this.selectedGameId = this.gameService.selectedGameId;
          this.updateSelectedGame();
          this.router.navigateByUrl('/dashboard').then();
        }
      })
  }

  private updateSelectedGame(): void {
    this.selectedGame = this.games.find(game => game.id === this.selectedGameId);

    if (!this.selectedGame) {
      this.showSelectGameDialog();
    }
  }

}
