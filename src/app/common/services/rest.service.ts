import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FlashMessageService} from "./flash-message.service";
import {catchError, Observable, of, OperatorFunction, throwError} from "rxjs";
import {ConfigService} from "./config.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(
    private http: HttpClient,
  ) { }

  public get<T>(endpoint: string, ignoreLoader = false): Observable<T> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-ignore-loader', `${ignoreLoader}`);

    return this.http.get<T>(ConfigService.config.baseApiUrl + endpoint, {headers});
  }

  public post<T>(endpoint: string, data: any, ignoreLoader = false): Observable<T> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-ignore-loader', `${ignoreLoader}`);

    return this.http.post<T>(ConfigService.config.baseApiUrl + endpoint, data,{headers});
  }

  public put<T>(endpoint: string, data: any, ignoreLoader = false): Observable<T> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-ignore-loader', `${ignoreLoader}`);

    return this.http.put<T>(ConfigService.config.baseApiUrl + endpoint, data,{headers});
  }

  public patch<T>(endpoint: string, data: any, ignoreLoader = false): Observable<T> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-ignore-loader', `${ignoreLoader}`);

    return this.http.patch<T>(ConfigService.config.baseApiUrl + endpoint, data,{headers});
  }

  public delete<T>(endpoint: string, ignoreLoader = false): Observable<T> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('x-ignore-loader', `${ignoreLoader}`);

    return this.http.delete<T>(ConfigService.config.baseApiUrl + endpoint, {headers});
  }

  public upload<T>(endpoint: string, data: FormData): Observable<T> {
    return this.http.post<T>(ConfigService.config.baseApiUrl + endpoint, data);
  }
}
