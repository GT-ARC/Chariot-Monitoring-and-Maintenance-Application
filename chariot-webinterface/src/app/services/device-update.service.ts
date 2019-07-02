import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {__metadata} from 'tslib';

@Injectable({
  providedIn: 'root'
})
export class DeviceUpdateService {

  constructor(private socket: Socket) { }

  sendMessage(msg: string){
    this.socket.emit("message", msg);
  }
  getMessage() {
    return this.socket
      .fromEvent("message")
      .subscribe(value => console.log("Message received: " + value));
  }
}
