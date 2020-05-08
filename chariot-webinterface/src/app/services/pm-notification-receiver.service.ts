import {EventEmitter, Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {NotifierService} from 'angular-notifier';
import {Device, Property} from '../../model/device';
import {RestService} from './rest.service';
import {DataHandlingService} from './data-handling.service';
import {Issue} from '../../model/issue';
import {Service, ServiceProperty} from '../../model/service';
import {Metadata} from "../../model/Metadata";
import {strings} from "../../environments/strings";

@Injectable({
  providedIn: 'root'
})
export class PmNotificationReceiverService {

  constructor(private dataService: DataHandlingService,
              private notifierService: NotifierService,
              private restService : RestService,
              private socket: Socket
  ) {
    this.getMetaData()
  }

  metaData: Metadata;

  private _newIssueEvent: EventEmitter<Issue> = new EventEmitter<Issue>();
  private _issueResolvedEvent: EventEmitter<Issue> = new EventEmitter<Issue>();

  private subscribeToPMNotifications(property: ServiceProperty, device: Device) {

     let sendMessage = {
       topic: property.kafka_topic,
       regex: false
     };

     // subscribe to the issue topic globaly
     this.socket.emit('subscribe', JSON.stringify(sendMessage));
     this.socket.fromEvent<string>(sendMessage.topic).subscribe(message => {

       let jsonMessage = JSON.parse(message);

       console.log('Issue message: ', jsonMessage, property);
       if (jsonMessage.value && !property.value) {
         // Issue detected
         property.value = jsonMessage.value;
         // Issue detected
         let issue = this.createIssue(property, { x: jsonMessage.timestamp, y: jsonMessage.value }, device);
         let successful = this.dataService.addIssue(issue);
         if (successful){
           console.log("Added issue: " + JSON.stringify(issue));
           this.addIssue(device, issue, true);
         }
         // Check for pm result
       } else if (!jsonMessage.value && property.value) {
         property.value = jsonMessage.value;
         this.resolveIssue(device, device.getLastIssue(), true);
       }
     });
  }

  get newIssueEvent(): EventEmitter<Issue> {
    return this._newIssueEvent;
  }

  get issueResolvedEvent(): EventEmitter<Issue> {
    return this._issueResolvedEvent;
  }

  getIssues() {
    this.restService.getServices().subscribe(data => {

      if(this.metaData.devicesSynchronised)
        this.parseTheServices(data);
      else {
        console.log("Wait till the devices are synchronised");
        this.metaData.deviceEventEmitter.addListener('synchronised',
          () => this.parseTheServices(data)
        )
      }
    });
  }

  private parseTheServices(data) {
    console.log(data);

    let pm_services = (data as Array<Service>).filter(
       service => service.name == strings.pm_service_indicator)
    ;

    if (pm_services.length == 0) {
      console.log("No PM-Service found");
      this.updateMetadata();
      return;
    }

    pm_services.forEach(service => {
      if (service.properties.length == 0)
        this.updateMetadata();
      service.properties.forEach(property => {
        let relatedTo = property.relatedTo;
        if (relatedTo && relatedTo.length == 0) {
          this.updateMetadata();
          return;
        }

        let device = this.dataService.getDeviceByURL(relatedTo[0]);

        if (device == null) {
          console.log("Referenced device not found");
          this.updateMetadata();
          return;
        }

        this.restService.getHistoryData(property.url).subscribe(reqData => {
          this.parseHistoryData(reqData, device, property);
          this.subscribeToPMNotifications(property, device);
          this.updateMetadata();
        });
      });
    });
  }

  private updateMetadata() {
    this.metaData.issuesSynchronised = true;
  }

  resolveIssue(device: Device, issue: Issue, notify : boolean = true) {
    console.log('Issue resolved: ');
    issue.state = true;
    device.resolveLastIssue();
    this.sendIssueEvent(this._issueResolvedEvent, issue);
    if(notify) this.notifierService.notify('success', 'Issue resolved ' + issue.identifier);
  }

  addIssue(device: Device, issue: Issue, notify : boolean = true) {
    console.log('Issue detected ', device);
    device.addIssue(issue);
    this.dataService.addIssue(issue);
    this.sendIssueEvent(this._newIssueEvent, issue);
    if(notify) this.notifierService.notify('error', 'Issue detected: ' + issue.identifier);
  }

  waitForSubmit = null;
  sendIssueEvent(newIssueEvent: EventEmitter<Issue>, issue: Issue) {
    this.waitForSubmit = issue;
    setTimeout(() => {
      if(this.waitForSubmit == issue){
        newIssueEvent.emit(issue);
        this.dataService.storeDeviceData();
      }
    }, 1000);
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
            // console.log("Added issue: " + JSON.stringify(issue));
            this.addIssue(device, issue, false);
          }
          // console.log("New Issue detected");
        } else if (!point.y && prevPoint) {
          this.resolveIssue(device, device.getLastIssue(), false);
          // console.log("Resolve last issue");
        }
        prevPoint = point.y;
      }
    }
  }

  createIssue(property: ServiceProperty, point: { x: number; y: any }, device: Device) {
    console.log(property.key + point.x);
    let issue: Issue = {
      identifier: "i" + ((+property.key + Math.round(point.x)) % 2147483647),
      state: false,
      description: '',
      type: '',
      issue_date: Math.round(point.x),
      importance: Math.floor(Math.random() * 100),
      name: device.name,
      relatedDeviceId: device.identifier,
      relatedTo: this.getRelatedProperty(property, device),
      url: property.url
    };
    return issue;
  }

  getRelatedProperty (property: ServiceProperty, device: Device) : Property[]{
    let retProperties = [];
    let relatedToProps: string[] = JSON.parse(JSON.stringify(property.relatedTo));
    for (let prop of device.properties) {
      if(relatedToProps.length == 0)
        return retProperties;
      for (let related of relatedToProps) {
        if(related.indexOf(prop.key) != -1) {
          retProperties.push(prop);
          relatedToProps.splice(relatedToProps.indexOf(related), 1);
        }
      }
    }
    return retProperties;
  }

  private getMetaData() {
    this.dataService.getMetadata().subscribe(data => this.metaData = data.metaData);
  }
}
