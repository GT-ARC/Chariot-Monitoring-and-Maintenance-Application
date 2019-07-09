import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {__metadata} from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class DeviceUpdateService {

  dataStream = this.socket.fromEvent<string>('data');

  constructor(private socket: Socket) { }

  subscribeToTopic(msg: string) {
    this.socket.emit("subscribe", msg);
  }
}
