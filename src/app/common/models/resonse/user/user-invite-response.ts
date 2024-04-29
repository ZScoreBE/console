import {UserInviteStatus} from "./user-invite-status";

export interface UserInviteResponse {
  id: string;
  email: string;
  name: string;
  status: UserInviteStatus
}
