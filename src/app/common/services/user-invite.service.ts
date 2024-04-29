import {Injectable} from '@angular/core';
import {RestService} from "./rest.service";
import {catchError, map, Observable, throwError} from "rxjs";
import {PaginatedCollection} from "../models/util/paginated-collection";
import {UserInviteResponse} from "../models/resonse/user/user-invite-response";
import {UserInviteRequest} from "../models/request/user/user-invite-request";
import {catchSomethingWrong} from "../utils/functions";

@Injectable({
  providedIn: 'root'
})
export class UserInviteService {

  constructor(
    private restService: RestService
  ) { }

  getPendingInvites(page: number, pageSize: number, search: string): Observable<PaginatedCollection<UserInviteResponse>> {
    let uri = `/users/invites/pending?page=${page}&size=${pageSize}`;

    if (search && search !== '') {
      uri += `&search=${search}`;
    }

    return this.restService.get<PaginatedCollection<UserInviteResponse>>(uri);
  }

  sendInvite(formData: any): Observable<UserInviteResponse>{
    const body: UserInviteRequest = {
      name: formData.name,
      email: formData.email
    };

    return this.restService.post<UserInviteResponse>(`/users/invites`, body)
      .pipe(
        catchError(error => this.handleCreateInviteError(error))
      );
  }

  getInvite(inviteCode: string): Observable<UserInviteResponse> {
    return this.restService.get<UserInviteResponse>(`/public/users/invites/by-code/${inviteCode}`)
      .pipe(catchSomethingWrong());
  }

  deleteInvite(invite: UserInviteResponse): Observable<boolean> {
    return this.restService.delete(`/users/invites/${invite.id}`)
      .pipe(
        map(() => true),
        catchSomethingWrong()
      );
  }

  private handleCreateInviteError(error: any): Observable<never> {
    if (error.error && error.error.errorKey === 'ALREADY_INVITED') {
      return throwError(() => 'ERRORS.userAlreadyInvited');
    }

    if (error.error && error.error.errorKey === 'USER_ALREADY_EXISTS') {
      return throwError(() => 'ERRORS.userAlreadyExists');
    }

    return throwError(() => 'ERRORS.somethingWentWrong');
  }
}
