import {Injectable} from '@angular/core';
import {FlashMessage} from "../models/util/flash-message";
import {FlashMessageType} from "../models/util/flash-message-type";

@Injectable({
  providedIn: 'root'
})
export class FlashMessageService {

  private currentMessage: FlashMessage = null;

  public setMessage(type: FlashMessageType, message: string): void {
    this.currentMessage = {type, message};
  }

  public getMessage(): FlashMessage {
    const msg = this.currentMessage;
    this.currentMessage = null;
    return msg;
  }

  public hasMessage(): boolean {
    return this.currentMessage !== undefined && this.currentMessage !== null;
  }
}
