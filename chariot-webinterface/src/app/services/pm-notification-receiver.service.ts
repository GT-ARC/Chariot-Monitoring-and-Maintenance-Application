import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotifierService} from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class PmNotificationReceiverService {

  serviceUrl = "http://chariot-km.dai-lab.de:8001/services/?format=json";
  serviceTopic = "kms.global.data.*.properties.pm-operation";

  constructor(private socket: Socket,
              private http: HttpClient,
              private notifierService: NotifierService
  ) {
    // let header: HttpHeaders = new HttpHeaders();
    // header.append("Access-Control-Allow-Origin", "*");
    // this.http.get(this.serviceUrl, {headers: header}).subscribe(message => {
    //   let json = JSON.parse(message as string);
    //   let service = (json as Array<any>).find(service => service['id'] == "pm-service");
    //
    //   let topic = (service["properties"] as Array<any>).find(props => props["key"] == 'pm-operation')['kafka_topic'];
    //
    // });
    this.socket.emit("subscribe", this.serviceTopic);
    this.socket.fromEvent<string>(this.serviceTopic).subscribe(message => { 
      this.notifierService.notify('error', 'Issue detected');
    })
  }
}
