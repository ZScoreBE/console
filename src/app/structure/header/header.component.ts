import {Component, HostListener, Inject, OnInit, Renderer2} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {GlobalEmitter} from "../../common/utils/global-emitter";
import {MOBILE_NAV_FROM_WIDTH, MODE_SWITCHED, WINDOW_SIZE_CHANGED} from "../../common/utils/defenitions";
import {SelectGameButtonComponent} from "./select-game-button/select-game-button.component";
import {UserDropDownComponent} from "./user-drop-down/user-drop-down.component";
import {GameService} from "../../common/services/game.service";
import {TranslateModule} from "@ngx-translate/core";
import {takeUntil} from "rxjs";
import {BaseComponent} from "../../base.component";
import {Router} from "@angular/router";
import {TranslatedToastrService} from "../../common/services/translated-toastr.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    SelectGameButtonComponent,
    UserDropDownComponent,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends BaseComponent implements OnInit {

  width: number;
  inSmallView: boolean;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private gameService: GameService,
    private router: Router,
    private translatedToastrService: TranslatedToastrService,
  ) {
    super();

    this.width = window.innerWidth;
    this.inSmallView = this.width < MOBILE_NAV_FROM_WIDTH;

    this.widthUpdated();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.width = event.target.innerWidth;
    this.widthUpdated();
  }

  ngOnInit(): void {
    GlobalEmitter.of<boolean>(WINDOW_SIZE_CHANGED).emit(this.inSmallView);
  }

  get isSandboxMode(): boolean {
    return this.gameService.isSandbox;
  }

  toggleSideBar(): boolean {
    if (this.inSmallView) {
      const shouldOpen = document.body.classList.contains("sidebar-closed");
      if (shouldOpen) {
        this.renderer.removeClass(this.document.body, 'sidebar-closed');
        this.renderer.removeClass(this.document.body, 'sidebar-collapse');
        this.renderer.addClass(this.document.body, 'sidebar-open');
      } else {
        this.renderer.addClass(this.document.body, 'sidebar-closed');
        this.renderer.addClass(this.document.body, 'sidebar-collapse');
        this.renderer.removeClass(this.document.body, 'sidebar-open');
      }
    } else {
      const shouldOpen = document.body.classList.contains("sidebar-collapse");
      if (shouldOpen) {
        this.renderer.removeClass(this.document.body, 'sidebar-collapse');
      } else {
        this.renderer.addClass(this.document.body, 'sidebar-collapse');
      }
    }

    return false;
  }

  switchMode(): void {
    const selectedId = this.gameService.selectedGameId;
    this.gameService.getAllGames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: games => {
          const currentGame = games.find(game => game.id === selectedId);

          if (!currentGame) return;

          const newGame = games.find(game => game.generationId === currentGame.generationId && game.sandboxMode !== currentGame.sandboxMode);

          if (!newGame) return;

          this.gameService.updateSelectedGame(newGame);
          GlobalEmitter.of<boolean>(MODE_SWITCHED).emit(true);
          this.router.navigateByUrl('/dashboard').then();
        },
        error: error => this.translatedToastrService.error(error)
      });
  }

  private widthUpdated(): void {
    if (this.inSmallView && this.width >= MOBILE_NAV_FROM_WIDTH) {
      this.renderer.removeClass(this.document.body, 'sidebar-closed');
      this.renderer.removeClass(this.document.body, 'sidebar-open');
      this.renderer.removeClass(this.document.body, 'sidebar-collapse');

      this.inSmallView = false;
      GlobalEmitter.of<boolean>(WINDOW_SIZE_CHANGED).emit(this.inSmallView);
      return;
    }

    if (!this.inSmallView && this.width < MOBILE_NAV_FROM_WIDTH) {
      this.renderer.addClass(this.document.body, 'sidebar-closed');
      this.renderer.addClass(this.document.body, 'sidebar-collapse');
      this.inSmallView = true;
      GlobalEmitter.of<boolean>(WINDOW_SIZE_CHANGED).emit(this.inSmallView);
    }
  }
}
