import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {NotifierService} from 'angular-notifier';
import {Device, Property} from '../../model/device';
import {RestService} from './rest.service';
import {DataHandlingService} from './data-handling.service';
import {Issue} from '../../model/issue';
import {Floor} from '../../model/floor';
import {Service, ServiceProperty} from '../../model/service';

@Injectable({
  providedIn: 'root'
})
export class PmNotificationReceiverService {

  constructor(private socket: Socket,
              private dataService: DataHandlingService,
              private notifierService: NotifierService,
              private restService : RestService
  ) { }

  private subscribeToPMNotifications(property: ServiceProperty, device: Device) {

    let sendMessage = {
      topic: property.kafka_topic,
      regex: false
    };

    // subscribe to the issue topic globaly
    this.socket.emit('subscribe', JSON.stringify(sendMessage));
    this.socket.fromEvent<string>(sendMessage.topic).subscribe(message => {

      let jsonMessage = JSON.parse(JSON.parse(message));

      console.log('Issue message: ', jsonMessage, property);
      if (jsonMessage.value && !property.value) {
        // Issue detected
        // device.createIssue();
        property.value = jsonMessage.value;
        // Issue detected
        console.log('Issue detected');
        this.notifierService.notify('error', 'Issue detected');
        this.dataService.dataUpdate();

        // Check for pm result
      } else if (!jsonMessage.value && property.value) {
        console.log('Issue resolved: ');
        device.resolveLastIssue();
        property.value = jsonMessage.value;
        this.notifierService.notify('success', 'Issue resolved');
        this.dataService.dataUpdate();
      }
    });
  }

  getIssues() {
    this.restService.getServices().subscribe(data => {

      let pm_services = (data as Array<Service>).filter(service => service.name == "PM-Service");

      pm_services.forEach(service => {
        service.properties.forEach(property => {

          let device = this.dataService.getDeviceByURL(property.url);

          this.restService.getHistoryData(property.url).subscribe(reqData => {
            this.parseHistoryData(reqData, device, property);
            this.subscribeToPMNotifications(property, device);
          });
        });
      });
    });
  }

  private parseHistoryData(reqData: Object, device: Device, property: ServiceProperty) {
    if (reqData.hasOwnProperty('value')) {

      let historyData: { x: number, y: any }[] = reqData['value'];
      if (historyData.length != 0) {
        return;
      }
      if (device.getLastIssue() != undefined) {
        historyData = historyData.filter((point) => point.x > device.getLastIssue().issue_date);
      }

      let prevPoint = false;
      for (let point of historyData) {
        if (point.y && !prevPoint) {
          let issue = this.createIssue(property, point, device);
          device.addIssue(issue);
          this.dataService.addIssue(issue);
          // console.log("New Issue detected");
        } else if (!point.y && prevPoint) {
          device.resolveLastIssue();
          // console.log("Resolve last issue");
        }
        prevPoint = point.y;
      }
    }
  }

  private createIssue(property: ServiceProperty, point: { x: number; y: any }, device: Device) {
    let issue: Issue = {
      identifier: property.key,
      state: false,
      description: '',
      type: '',
      issue_date: point.y,
      importance: Math.floor(Math.random() * 100),
      name: device.name,
      relatedDeviceId: device.identifier,
      relatedTo: property.relatedTo,
      url: property.url
    };
    return issue;
  }
}
