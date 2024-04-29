import { Component } from '@angular/core';
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {GravatarModule} from "ngx-gravatar";
import {RouterLink} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-user-drop-down',
  standalone: true,
  imports: [
    BsDropdownModule,
    GravatarModule,
    RouterLink,
    TranslateModule
  ],
  templateUrl: './user-drop-down.component.html',
  styleUrl: './user-drop-down.component.scss'
})
export class UserDropDownComponent {

}
