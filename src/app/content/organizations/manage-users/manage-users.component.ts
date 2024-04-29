import {Component} from '@angular/core';
import {TranslateModule} from "@ngx-translate/core";
import {MessageDisplayComponent} from "../../../common/components/message-display/message-display.component";
import {BaseComponent} from "../../../base.component";
import {UsersListComponent} from "./users-list/users-list.component";
import {InvitesListComponent} from "./invites-list/invites-list.component";
import {FlashMessageComponent} from "../../../common/components/flash-message/flash-message.component";

@Component({
  selector: 'app-manage-users',
  standalone: true,
    imports: [
        TranslateModule,
        MessageDisplayComponent,
        UsersListComponent,
        InvitesListComponent,
        FlashMessageComponent
    ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent extends BaseComponent {

}
