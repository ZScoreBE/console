import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading$ = new Subject<boolean>();

  show() {
    this.loading$.next(true);
  }

  hide() {
    this.loading$.next(false);
  }

  get isLoading(): Subject<boolean> {
    return this.loading$;
  }
}
