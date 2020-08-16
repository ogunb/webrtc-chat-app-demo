import { messageTypes } from "../enums/message";

export interface message {
  type: messageTypes;
  success?: Boolean;
  content: any;
}
