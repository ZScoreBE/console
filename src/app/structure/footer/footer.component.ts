import { Component } from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import packageJson from "../../package";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  readonly year = new Date().getFullYear();
  readonly version: string = packageJson.version;
}
