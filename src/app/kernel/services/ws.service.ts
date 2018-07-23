import {Injectable} from '@angular/core';
import {WS_CONNECT} from '../../kernel/libs/ws.lib';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {WebsocketSession} from '../model/websocket-session';
import {environment} from '../../../environments/environment';

@Injectable()
export class WS {
  session: WebsocketSession = null;
  connected: boolean = false;
  firstLoad: boolean = true;
  reconnectLoop;
  connecting: boolean = false;
  lastReconTime: Date = null;
}

@Injectable()
export class WsService {
  private toastrSent = false;

  constructor(private toastr: ToastrService, private translate: TranslateService, private ws: WS) {
  }

  publish(channel, obj) {
    this.connect().then(() => {
      if (this.ws.connected) {
        this.ws.session.publish(channel, obj)
      }
    });
  }

  subscribe(channel, callback) {
    this.connect().then(() => {
      if (this.ws.connected) {
        this.ws.session.subscribe(channel, callback);
      }
    });
  }

  unsubscribe(channel) {
    this.connect().then(() => {
      try {
        if (this.ws.connected) {
          this.ws.session.unsubscribe(channel);
        }
      }
      catch (e) {

      }
    });
  }

  private connect(): Promise<boolean> {
    console.log("CONNECTING");
    var promise = new Promise<boolean>((resolve, reject) => {
      setTimeout(() => {
        clearInterval(this.ws.reconnectLoop);
        if (this.ws.connected) {
          resolve(true);
        }
        else if (this.ws.connecting) {
          setTimeout(() => {
            resolve(this.connect.bind(this));
          }, 500);
        }
        else if (this.ws.lastReconTime == null ||
          this.ws.lastReconTime.getTime() < new Date().getTime() - environment.socket.reconnectWaitTimeMS) {
          this.ws.connecting = true;
          this.ws.lastReconTime = new Date();
          var con = WS_CONNECT.connect();
          console.log("con");

          con.on("socket/connect", (sess: any) => {
            if (!this.ws.firstLoad && this.ws.connected == false) {
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
              this.ws.firstLoad = false;
            }
            this.ws.session = sess;
            this.ws.connected = true;
            this.ws.connecting = false;
            resolve(true);
          });


          con.on("socket/disconnect", () => {
            this.ws.firstLoad = false;
            this.ws.connecting = false;

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
            this.ws.reconnectLoop = setInterval(() => this.connect(), environment.socket.reconnectWaitTimeMS);
            this.ws.session = null;
            this.ws.connected = false;
            resolve(false);
          });
        }
      }, 0);
    });
    return promise;
  }
}
