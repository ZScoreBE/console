import { Injectable } from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import {RestService} from "./rest.service";
import {catchError, map, Observable, tap, throwError} from "rxjs";
import {TokenRequest} from "../models/request/auth/token-request";
import {TokenResponse} from "../models/resonse/auth/token-response";
import {catchSomethingWrong} from "../utils/functions";
import {RefreshTokenRequest} from "../models/request/auth/refresh-token-request";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private static readonly ACCESS_TOKEN_KEY: string = "accessToken";
  private static readonly REFRESH_TOKEN_KEY: string = "refreshToken";

  private readonly jwtHelper: JwtHelperService;

  constructor(
    private restService: RestService
  ) {
    this.jwtHelper = new JwtHelperService();
  }

  signIn(email: string, password: string): Observable<boolean> {
    const body: TokenRequest = {username: email, password: password};

    return this.restService.post<TokenResponse>('/public/auth/token', body)
      .pipe(
        tap(tokenResponse => this.saveTokens(tokenResponse)),
        map(() => true),
        catchError(error => this.handleSignInError(error)),
      )
  }

  refreshToken(): Observable<boolean> {
    if (!this.hasValidRefreshToken()) {
      return throwError(() => "ERRORS.somethingWrong");
    }

    const body: RefreshTokenRequest = {refreshToken: this.getRefreshToken()};
    return this.restService.post<TokenResponse>('/public/auth/token/refresh', body, true)
      .pipe(
        tap(tokenResponse => this.saveTokens(tokenResponse)),
        map(() => true),
        catchSomethingWrong()
      );
  }

  getToken(): string {
    const accessToken = localStorage.getItem(AuthService.ACCESS_TOKEN_KEY);

    return this.isValid(accessToken) ? accessToken : null;
  }

  getRefreshToken(): string {
    const refreshToken = localStorage.getItem(AuthService.REFRESH_TOKEN_KEY);

    return this.isValid(refreshToken) ? refreshToken : null;
  }

  logout(): void {
    localStorage.removeItem(AuthService.ACCESS_TOKEN_KEY);
    localStorage.removeItem(AuthService.REFRESH_TOKEN_KEY);
    // GlobalEmitter.of(USER_LOGIN_STATUS_EMITTER).emit(false);
  }

  isAuthorized(): boolean {
    return this.getToken() !== null || this.hasValidRefreshToken();
  }

  hasValidAccessToken(): boolean {
    return this.getToken() !== null;
  }

  hasValidRefreshToken(): boolean {
    return this.getRefreshToken() !== null;
  }

  tokenIncludesRole(role: string):boolean {
    const token = this.getToken();

    if(!token) return false;

    return (this.jwtHelper.decodeToken<any>(token).roles as string[]).includes(role);
  }

  private saveTokens(tokenResponse: TokenResponse): void {
    localStorage.setItem(AuthService.ACCESS_TOKEN_KEY, tokenResponse.accessToken);
    localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, tokenResponse.refreshToken);
  }

  private handleSignInError(error: any): Observable<never> {
    if (error.error && error.error.errorKey === 'NOT_ACTIVATED') {
      return throwError(() => 'ERRORS.userNotActivated');
    }

    return throwError(() => 'ERRORS.invalidLogin');
  }

  private isValid(token: string): boolean {
    return token && !this.jwtHelper.isTokenExpired(token);
  }
}
