import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../structure/header/header.component";
import {Router, RouterOutlet} from "@angular/router";
import {FooterComponent} from "../structure/footer/footer.component";
import {SideBarComponent} from "../structure/side-bar/side-bar.component";
import {GameService} from "../common/services/game.service";
import {takeUntil} from "rxjs";
import {MessageDisplayComponent} from "../common/components/message-display/message-display.component";
import {BaseComponent} from "../base.component";
import {AlertModule} from "ngx-bootstrap/alert";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    SideBarComponent,
    MessageDisplayComponent,
    AlertModule,
    TranslateModule
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent extends BaseComponent implements OnInit {

  loadingDone: boolean = false;

  constructor(
    private gameService: GameService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.gameService.hasGames()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: result => this.initialize(result),
        error: error => this.handleError(error),
        complete: () => this.loadingDone = true
      });
  }

  get isSandboxMode(): boolean {
    return this.gameService.isSandbox;
  }

  get hasGameSelected(): boolean {
    return this.gameService.selectedGameId !== null;
  }

  private initialize(result: boolean): void {
    if (!result) {
      this.router.navigateByUrl('/action/create-game').then();
    }
  }
}
