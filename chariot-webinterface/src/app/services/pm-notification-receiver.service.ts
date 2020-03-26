import {EventEmitter, Injectable} from '@angular/core';
// import {Socket} from 'ngx-socket-io';
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

  constructor(private dataService: DataHandlingService,
              private notifierService: NotifierService,
              private restService : RestService
  ) { }

  private _newIssueEvent: EventEmitter<Issue> = new EventEmitter<Issue>();
  private _issueResolvedEvent: EventEmitter<Issue> = new EventEmitter<Issue>();

  private subscribeToPMNotifications(property: ServiceProperty, device: Device) {
    //
    // let sendMessage = {
    //   topic: property.kafka_topic,
    //   regex: false
    // };
    //
    // // subscribe to the issue topic globaly
    // this.socket.emit('subscribe', JSON.stringify(sendMessage));
    // this.socket.fromEvent<string>(sendMessage.topic).subscribe(message => {
    //
    //   let jsonMessage = JSON.parse(JSON.parse(message));
    //
    //   console.log('Issue message: ', jsonMessage, property);
    //   if (jsonMessage.value && !property.value) {
    //     // Issue detected
    //     // device.createIssue();
    //     property.value = jsonMessage.value;
    //     // Issue detected
    //     console.log('Issue detected');
    //     this.notifierService.notify('error', 'Issue detected');
    //     this.dataService.dataUpdate();
    //
    //     // Check for pm result
    //   } else if (!jsonMessage.value && property.value) {
    //     console.log('Issue resolved: ');
    //     device.resolveLastIssue();
    //     property.value = jsonMessage.value;
    //     this.notifierService.notify('success', 'Issue resolved');
    //     this.dataService.dataUpdate();
    //   }
    // });
  }


  get newIssueEvent(): EventEmitter<Issue> {
    return this._newIssueEvent;
  }

  get issueResolvedEvent(): EventEmitter<Issue> {
    return this._issueResolvedEvent;
  }

  getIssues() {
    this.restService.getServices().subscribe(data => {

      console.log(data);

      let pm_services = (data as Array<Service>).filter(service => service.name == "PM-Service");

      pm_services.forEach(service => {
        service.properties.forEach(property => {
          let relatedTo = property.relatedTo;
          if(relatedTo && relatedTo.length == 0)
            return;

          let device = this.dataService.getDeviceByURL(relatedTo[0]);

          this.restService.getHistoryData(property.url).subscribe(reqData => {
            this.parseHistoryData(reqData, device, property);
            this.subscribeToPMNotifications(property, device);
          });
        });
      });
    });
  }

  resolveIssue(device: Device, issue: Issue) {
    console.log('Issue resolved: ');
    issue.state = true;
    device.resolveLastIssue();
    this._issueResolvedEvent.emit(issue);
    this.notifierService.notify('success', 'Issue resolved');
  }

  addIssue(device: Device, issue: Issue) {
    console.log('Issue detected ', device);
    device.addIssue(issue);
    this.dataService.addIssue(issue);
    this._newIssueEvent.emit(issue);
    this.notifierService.notify('error', 'Issue detected' + issue.identifier);
  }

  private parseHistoryData(reqData: Object, device: Device, property: ServiceProperty) {
    if (reqData.hasOwnProperty('value') && device != undefined) {

      let historyData: { x: number, y: any }[] = reqData['value'];
      if (historyData.length == 0) {
        return;
      }
      if (device.getLastIssue() != undefined) {
        console.log("Filter Issue Data");
        historyData = historyData.filter((point) => point.x >= device.getLastIssue().issue_date);
      }

      let prevPoint = false;
      for (let point of historyData) {
        if (point.y && !prevPoint) {
          let issue = this.createIssue(property, point, device);
          let successful = this.dataService.addIssue(issue);
          if (successful){
            console.log("Added issue: " + JSON.stringify(issue));
            device.addIssue(issue);
            this.dataService.dataUpdate();
          }
          // console.log("New Issue detected");
        } else if (!point.y && prevPoint) {
          device.resolveLastIssue();
          this.dataService.dataUpdate();
          // console.log("Resolve last issue");
        }
        prevPoint = point.y;
      }
    }
  }

  createIssue(property: ServiceProperty, point: { x: number; y: any }, device: Device) {
    console.log(property.key + point.x);
    let issue: Issue = {
      identifier: "i" + ((+property.key + point.x) % 2147483647),
      state: false,
      description: '',
      type: '',
      issue_date: point.x,
      importance: Math.floor(Math.random() * 100),
      name: device.name,
      relatedDeviceId: device.identifier,
      relatedTo: device.properties,
      url: property.url
    };
    return issue;
  }
}
