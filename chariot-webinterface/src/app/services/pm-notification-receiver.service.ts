import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {NotifierService} from 'angular-notifier';
import {Device, Property} from '../../model/device';
import {RestService} from './rest.service';
import {DataHandlingService} from './data-handling.service';
import {Issue} from '../../model/issue';

@Injectable({
  providedIn: 'root'
})
export class PmNotificationReceiverService {

  constructor(private socket: Socket,
              private dataService: DataHandlingService,
              private notifierService: NotifierService,
              private restService : RestService
  ) {
    // let header: HttpHeaders = new HttpHeaders();
    // header.append("Access-Control-Allow-Origin", "*");
    // this.http.get(this.serviceUrl, {headers: header}).subscribe(message => {
    //    let json = JSON.parse(message as string);
    //    let service = (json as Array<any>).find(service => service['id'] == "pm-service");
    //
    //    let topic = (service["properties"] as Array<any>).find(props => props["key"] == 'pm-operation')['kafka_topic'];
    //    this.serviceTopic.topic = topic;
    //     this.socket.emit("subscribe", JSON.stringify(this.serviceTopic));
    //     this.socket.fromEvent<string>(this.serviceTopic.topic).subscribe(message => {
    //       this.notifierService.notify('error', 'Issue detected');
    //     })
    //  });
  }

  lastProperty = {};
  lastUpdateId = "";

  public getIssuesAndSubscribeToPmResult(property : Property, device: Device) {
    let sendMessage = {
      topic: property.topic,
      regex: false
    };

    if (property.url != undefined){
      this.restService.getHistoryData(property.url).subscribe(regData => {
        if(regData.hasOwnProperty("value")) {
          let historyData: {x: number, y: any}[] = regData['value'];
          let prevPoint = false;
          // device.issues = [];
          let lastIssue: Issue = device.getLastIssue();
          if (lastIssue)
            historyData = historyData.filter((point) => point.x > lastIssue.issue_date);
          for (let point of historyData) {
            if (point.y && !prevPoint) {
              device.addIssue(point.x);
              // console.log("New Issue detected");
            } else if (!point.y && prevPoint) {
              device.resolveLastIssue();
              // console.log("Resolve last issue");
            }
            prevPoint = point.y;
          }
        }
        for(let issue of device.issues) this.dataService.addIssue(issue);
        // console.log("get issue from history data: ",device, device.getIssueID());
        this.lastUpdateId = device.identifier;
        setTimeout(() => {
          if(this.lastUpdateId == device.identifier){
            this.dataService.dataUpdate();
          }
        }, 400)
      });
    }
    // subscribe to the issue topic globaly
    this.socket.emit("subscribe", JSON.stringify(sendMessage));
    this.socket.fromEvent<string>(sendMessage.topic).subscribe(message => {

      let jsonMessage = JSON.parse(JSON.parse(message));

      console.log("Issue message: ", jsonMessage, property);
      if (jsonMessage.value && !property.value) {
        // Issue detected
        device.addIssue();
        property.value = jsonMessage.value;
        // Issue detected
        console.log("Issue detected");
        this.notifierService.notify('error', 'Issue detected');
        this.dataService.dataUpdate();
        // Check for pm result
      } else if (!jsonMessage.value && property.value) {
        console.log("Issue resolved: ");
        device.resolveLastIssue();
        property.value = jsonMessage.value;
        this.notifierService.notify('success', 'Issue resolved');
        this.dataService.dataUpdate();
      }
    })
  }

}
