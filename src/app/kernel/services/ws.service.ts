import {Injectable} from '@angular/core';
import {WS_CONNECT} from '../../kernel/libs/ws.lib';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {WebsocketSession} from '../model/websocket-session';
import {environment} from '../../../environments/environment';
import {DiscoInfo} from "../model/disco-info";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class WsService {
  private toastrSent = false;
  session: WebsocketSession = null;
  sessionLoading: Promise<WebsocketSession> = null;
  connected: boolean = false;
  firstLoad: boolean = true;
  reconnectLoop;
  connecting: boolean = false;
  lastReconTime: Date = null;

  constructor(private toastr: ToastrService, private translate: TranslateService) {
  }

  publish(channel, obj) {
    this.connect().then(() => {
      if (this.connected) {
        this.session.publish(channel, obj)
      }
    });
  }

  subscribe(channel, callback) {
    this.connect().then(() => {
      if (this.connected) {
        this.session.subscribe(channel, callback);
      }
    });
  }

  unsubscribe(channel) {
    this.connect().then(() => {
      try {
        if (this.connected) {
          this.session.unsubscribe(channel);
        }
      }
      catch (e) {

      }
    });
  }


  private connect(): Promise<WebsocketSession> {
    console.log("CONNECTING");
    return new Promise((resolveGeneral, rejectGeneral) => {
      if (this.session === null) {
        if (this.sessionLoading === null) {
          this.sessionLoading = new Promise((resolveInternal, rejectInternal) => {

            var con = WS_CONNECT.connect();
            console.log("con");

            con.on("socket/connect", (sess: any) => {
              if (!this.firstLoad && this.connected == false) {
                this.toastr.clear();
                this.translate.get("ws.reconnect").subscribe((res: string) => {
                  this.toastr.info(
                    "",
                    res
                  );
                });
                this.toastrSent = false;
              }
              else {
                this.firstLoad = false;
              }

              this.sessionLoading = null;

              this.session = sess;
              this.connected = true;
              this.connecting = false;
              resolveInternal(this.session);
              resolveGeneral(this.session);
            });


            con.on("socket/disconnect", () => {
              this.firstLoad = false;
              this.connecting = false;

              if (!this.toastrSent) {
                this.translate.get("ws.disconnected").subscribe((res: string) => {
                  this.toastr.error(
                    "",
                    res, {
                      progressBar: false,
                      tapToDismiss: false,
                      disableTimeOut: true
                    }
                  );
                });
                this.toastrSent = true;
              }

              resolveInternal(new WebsocketSession());
              resolveGeneral(new WebsocketSession());
            });

          });
        }
        else {
          this.sessionLoading.then(res => {
            resolveGeneral(this.session)
          });
        }
      }
      else {
        resolveGeneral(this.session);
      }
    });
  }
}
