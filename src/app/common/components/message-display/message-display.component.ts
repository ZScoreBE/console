import {Component, Input} from '@angular/core';
import {AlertModule} from "ngx-bootstrap/alert";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-message-display',
  standalone: true,
  imports: [
    AlertModule,
    TranslateModule
  ],
  templateUrl: './message-display.component.html',
  styleUrl: './message-display.component.scss'
})
export class MessageDisplayComponent {

  @Input() error: string = null;
  @Input() success: string = null;
  @Input() id = '';
}
