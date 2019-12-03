import {Injectable} from '@angular/core';
import { Socket } from 'ngx-socket-io';


@Injectable({
  providedIn: 'root'
})
export class DeviceUpdateService {

  constructor(private socket: Socket) { }
  topicList = [];


  subscribeToTopic(topic: string) {
    let message = {
      topic: topic,
      regex: false
    };
    if(this.topicList.indexOf(topic) == -1){
      // console.log("Subscribe to topic: " + topic);
      this.socket.emit("subscribe", JSON.stringify(message));
      this.topicList.push(topic);
    }
    return this.socket.fromEvent<string>(topic);
  }

  unSubscribeOfTopic(topic: string) {
    // console.log("UnSubscribe to topic: " + topic);
    this.topicList.splice(this.topicList.indexOf(topic), 1);
    this.socket.emit("unsubscribe", topic);
  }

  unSubscribeDevice() {
    this.topicList.forEach( element => {
      this.socket.emit("unsubscribe", element);
    });
    this.topicList = [];
    this.socket.removeAllListeners();
  }
}
