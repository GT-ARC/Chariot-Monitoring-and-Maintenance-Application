import {Injectable} from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class DeviceUpdateService {

  constructor(private socket: Socket) { }
  topicList = [];


  subscribeToTopic(topic: string) {
    if(this.topicList.indexOf(topic) == -1){
      this.socket.emit("subscribe", topic);
      this.topicList.push(topic);
    }
    return this.socket.fromEvent<string>(topic);
  }

  unSubscribeOfTopic(topic: string) {
    console.log("Unsubscribe");

  }

  unSubscribeDevice() {
    this.topicList.forEach( element => {
      this.socket.emit("unsubscribe", element);
    });
    this.topicList = [];
    this.socket.removeAllListeners();
  }
}
