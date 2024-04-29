import {Component, OnInit} from '@angular/core';
import {FlashMessage} from "../../models/util/flash-message";
import {FlashMessageService} from "../../services/flash-message.service";
import {AlertModule} from "ngx-bootstrap/alert";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-flash-message',
  standalone: true,
  imports: [
    AlertModule,
    TranslateModule
  ],
  templateUrl: './flash-message.component.html',
  styleUrl: './flash-message.component.scss'
})
export class FlashMessageComponent implements OnInit {

  public message: FlashMessage = null;

  constructor(private flashMessageService: FlashMessageService) {
  }

  ngOnInit() {
    this.message = this.flashMessageService.getMessage();
  }


}
