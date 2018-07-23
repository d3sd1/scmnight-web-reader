import {Injectable} from '@angular/core';
import {WS_CONNECT} from '../../kernel/libs/ws.lib';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';
import {WebsocketSession} from '../model/websocket-session';
import {environment} from '../../../environments/environment';
import {DiscoInfo} from "../model/disco-info";
import {HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";

@Injectable()
export class WsService {
  session: WebsocketSession = null;
  connected: boolean = false;
  connecting = null;
  firstConnect = true;
  isConnecting = false;
  pendingOperations = [];
  currentOperations = {};
  onConnectOperations = [];
  onDisconnectOperations = [];

  constructor(private toastr: ToastrService, private translate: TranslateService) {
  }

  private addToQueue(opName) {
    this.pendingOperations.push(opName);
  }

  private removeFromQueue(opName) {
    const index = this.pendingOperations.findIndex((task) => task == opName);
    if (index !== -1) {
      this.pendingOperations.splice(index, 1);
    }
  }


  private removeDuplicatesFromQueue() {
    this.pendingOperations = this.pendingOperations.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

  private addToCurrentoperations(opName, callback) {
    this.currentOperations[opName] = callback;
  }

  private removeDuplicatesFromCurrent() {
    this.pendingOperations = this.pendingOperations.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
  }

  private reconnectOldStuff() {
    for (var key in this.currentOperations) {
      this.currentOperations[key]();
    }
  }

  public onConnect(callback) {
    this.onConnectOperations[this.onConnectOperations.length] = callback;
    if (this.connected) {
      callback();
    }
  }

  private onConnectPush() {
    for (let x = 0; x < this.onConnectOperations.length; x++) {
      this.onConnectOperations[x]();
    }
  }

  public onDisconnect(callback) {
    this.onDisconnectOperations[this.onDisconnectOperations.length] = callback;
    if (!this.connected) {
      callback();
    }
  }

  private onDisconnectPush() {
    for (let x = 0; x < this.onDisconnectOperations.length; x++) {
      this.onDisconnectOperations[x]();
    }
  }

  public publish(channel, obj) {
    const opName = "publish_" + channel;
    this.addToQueue(opName);
    this.getConnection().then(() => {
      if (this.connected) {
        this.removeFromQueue(opName);
        this.addToCurrentoperations(opName, () => {
          this.publish(channel, obj)
        });
        this.session.publish(channel, obj);
      }
    });
  }

  public subscribe(channel, callback) {
    const opName = "subscribe_" + channel;
    this.addToQueue(opName);
    this.getConnection().then((e) => {
      if (this.connected) {
        this.removeFromQueue(opName);
        this.addToCurrentoperations(opName, () => {
          this.subscribe(channel, callback)
        });
        try {
          this.session.subscribe(channel, callback);
        }
        catch (e) {
          console.debug("WS tiny catch (subscribe): ", e);
        }
      }
    });
  }

  public unsubscribe(channel) {
    const opName = "unsubscribe_" + channel;
    this.addToQueue(opName);
    this.getConnection().then(() => {
      try {
        if (this.connected) {
          this.removeFromQueue(opName);
          this.addToCurrentoperations(opName, () => {
            this.unsubscribe(channel)
          });
          this.session.unsubscribe(channel);
        }
      }
      catch (e) {
        console.debug("WS tiny catch (unsubscribe): ", e);
      }
    });

  }

  private wsConnection(): Promise<boolean> {
    this.isConnecting = true;
    let promise = new Promise<boolean>((resolve) => {
      let con = WS_CONNECT.connect();

      con.on("socket/connect", (sess: any) => {
        if (this.firstConnect === false && this.connected == false) {
          this.toastr.clear();
          this.translate.get("ws.reconnect").subscribe((res: string) => {
            this.toastr.info(
              "",
              res
            );
          });
        }
        this.removeDuplicatesFromQueue();
        this.removeDuplicatesFromCurrent();
        this.reconnectOldStuff();
        this.connected = true;
        this.session = sess;
        this.isConnecting = false;
        this.firstConnect = true;
        this.onConnectPush();
        resolve(true);
      });


      con.on("socket/disconnect", () => {
        if (this.firstConnect) {
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
        }
        this.connected = false;
        this.session = null;
        this.isConnecting = false;
        /* Prevent hyper-threading unnecessary */
        if (this.firstConnect) {
          this.onDisconnectPush();
        }
        this.firstConnect = false;
        resolve(false);
      });
    });
    return promise;
  }

  private getConnectionWrapper(resolveCon) {
    this.wsConnection().then((success) => {
      if (success) {
        resolveCon();
      }
      else {
        if (this.firstConnect) {
          this.getConnectionWrapper(resolveCon);
        }
        else {
          setTimeout(() => this.getConnectionWrapper(resolveCon), 1500);
        }
      }
    });
  }

  private getConnection() {
    if (this.isConnecting === false && this.connected === false) {
      this.connecting = new Promise((resolveCon, reject) => {
        this.getConnectionWrapper(resolveCon);
      });
    }
    return this.connecting;
  }

}
