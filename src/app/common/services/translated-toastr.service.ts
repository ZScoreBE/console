import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class TranslatedToastrService {

  constructor(private translateService: TranslateService,
              private toastrService: ToastrService) {
  }

  error(key: string, translationValues: any = {}): void {
    this.toastrService.error(this.translate(key, translationValues), null, {enableHtml: true});
  }

  success(key: string, translationValues: any = {}): void {
    this.toastrService.success(this.translate(key, translationValues), null, {enableHtml: true});
  }

  info(key: string, translationValues: any = {}): void {
    this.toastrService.info(this.translate(key, translationValues), null, {enableHtml: true});
  }

  warning(key: string, translationValues: any = {}): void {
    this.toastrService.warning(this.translate(key, translationValues), null, {enableHtml: true});
  }

  show(type: string, key: string, translationValues: any = {}): void {
    switch (type.toLowerCase()) {
      case 'error':
      case 'danger':
        this.error(key, translationValues);
        break;
      case 'success':
        this.success(key, translationValues);
        break;
      case 'info':
        this.info(key, translationValues);
        break;
      case 'warning':
        this.warning(key, translationValues);
        break;
    }
  }

  private translate(key: string, translationValues: any = {}): string {
    return this.translateService.instant(key, translationValues);
  }
}
