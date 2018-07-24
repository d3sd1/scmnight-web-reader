import {UserChatStatus} from "./user-chat-status";

export class User {
  public id: number = null;
  public firstname: string = null;
  public lastname: string = null;
  public dni: String = null;
  public password: String;
  public newpass: String;
  public email: string = null;
  public telephone: number = null;
  public address: string = null;
  public lang_code: string = null;
  public chat_status: UserChatStatus = null;
  public chat_notifications: boolean = false;
}
