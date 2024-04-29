import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {takeUntil} from "rxjs";
import {BaseComponent} from "./base.component";
import {AppConfig} from "./common/models/util/app-config";
import {ConfigService} from "./common/services/config.service";
import {LoadingComponent} from "./common/components/loading/loading.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent extends BaseComponent implements OnInit {

  config: AppConfig;

  constructor(
    private configService: ConfigService
  ) {
    super();
  }

  ngOnInit(): void {
    this.configService.config$.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe(config => this.config = config)
  }

}
