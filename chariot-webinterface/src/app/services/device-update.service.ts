import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {__metadata} from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class DeviceUpdateService {

  constructor(private socket: Socket) { }

  subscribeToTopic(msg: string) {
    this.socket.emit("subscribe", msg);
    return this.socket.fromEvent<string>('data');
  }

  unSubscribeOfTopic(topic: string) {
    this.socket.emit("unsubscribe", topic);
    this.socket.removeAllListeners();
  }
}
