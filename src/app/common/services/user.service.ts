import {Injectable} from '@angular/core';
import {RestService} from "./rest.service";
import {catchError, map, Observable, throwError} from "rxjs";
import {RegisterRequest} from "../models/request/user/register-request";
import {catchSomethingWrong} from "../utils/functions";
import {UserResponse} from "../models/resonse/user/user-response";
import {UpdateUserRequest} from "../models/request/user/update-user-request";
import {PaginatedCollection} from "../models/util/paginated-collection";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private restService: RestService
  ) {
  }

  registerUser(formData: any, inviteCode: string): Observable<boolean> {
    const body: RegisterRequest = {
      organization: {name: formData.organizationName},
      user: {
        name: formData.name,
        email: formData.email,
        password: formData.password
      },
      inviteCode: inviteCode
    };

    return this.restService.post('/public/registration', body)
      .pipe(
        map(() => true),
        catchError(error => this.handleUserCreateError(error))
      );
  }

  activateUser(code: string): Observable<boolean> {
    return this.restService.post('/public/users/activate', {code})
      .pipe(
        map(() => true),
        catchSomethingWrong()
      );
  }

  getMyself(): Observable<UserResponse> {
    return this.restService.get<UserResponse>(`/users/myself`)
      .pipe(catchSomethingWrong());
  }

  updateMyself(formData: any): Observable<UserResponse> {
    const body: UpdateUserRequest = {
      name: formData.name,
    };

    return this.restService.put<UserResponse>(`/users/myself`, body)
      .pipe(catchSomethingWrong());
  }

  getUsers(page: number, pageSize: number, search: string): Observable<PaginatedCollection<UserResponse>> {
    let uri = `/users?page=${page}&size=${pageSize}`;

    if (search && search !== '') {
      uri += `&search=${search}`;
    }

    return this.restService.get<PaginatedCollection<UserResponse>>(uri);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.restService.post(`/public/users/forgot-password`, {email})
      .pipe(
        map(() => true),
        catchSomethingWrong()
      );
  }

  private handleUserCreateError(error: any): Observable<never> {
    if (error.error && error.error.errorKey === 'USER_EMAIL_NOT_UNIQUE') {
      return throwError(() => 'ERRORS.userEmailNotUnique');
    }

    return throwError(() => 'ERRORS.somethingWentWrong');
  }
}
