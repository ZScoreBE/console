import {OrganizationRequest} from "./organization-request";
import {UserRequest} from "./user-request";

export interface RegisterRequest {
  organization: OrganizationRequest;
  user: UserRequest;
  inviteCode: string;
}
