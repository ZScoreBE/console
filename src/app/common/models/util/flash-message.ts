import {FlashMessageType} from "./flash-message-type";

export interface FlashMessage {
  type: FlashMessageType;
  message: string;
}
