import {Component, EventEmitter, HostListener, ViewChild} from '@angular/core';
import {DataHandlingService} from "./services/data-handling.service";
import {Location as Locl} from "@angular/common";
import {PmNotificationReceiverService} from './services/pm-notification-receiver.service';
import {Floor} from '../model/floor';
import {RestService} from './services/rest.service';
import {Device} from "../model/device";
import {NotifierService} from "angular-notifier";
import {MockDataService} from "./services/mock-data.service";
import {Issue} from "../model/issue";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chariot webinterface';

  window = window;
  path: string;

  sites: { route: string, icon: string, name: string }[] = [
    {route: "/devices", icon: "location_on", name: "Devices"},
    {route: "/warehouse", icon: "home", name: "Warehouse"},
    {route: "/process_flow", icon: "linear_scale", name: "ProductProcess "},
    {route: "/maintenance", icon: "warning", name: "Maintenance"},
    {route: "/settings", icon: "settings", name: "Settings"},
  ];
  sitesReversed = this.sites.reverse();

  mockIssueDevice: Device;

  constructor(
    private locationService: Locl,
    private mockDataService: MockDataService,
    private notifierService: NotifierService,
    private pmService: PmNotificationReceiverService,
    private restService: RestService,
    private dataService: DataHandlingService,
  ) {
    // console.log = () => {};
  }

  ngOnInit() {

    setInterval(_ => this.mockPMStuff(), 30000);

    // Receive the data from the backend
    // this.restService.getDeviceData().subscribe(data => {
    //     let parsedData = this.restService.parseDeviceData(data as Array<any>);
    //     let newFloor : Floor = new Floor(
    //       "MyFloorId",
    //       'IoT Testbed',
    //       11,
    //       parsedData.location,
    //     );
    //
    //     console.log("Add new data");
    //     this.dataService.handleNewFloor(newFloor).forEach(d =>
    //       d.properties.filter(p => p.key == "pm_result")
    //     );
    //
    //     this.pmService.getIssues();
    //
    //     console.log(parsedData);
    //   }
    // );

    this.path = this.locationService.path();
    console.log("App: the path" + this.path);
    // AppComponent.toggleNav(window.innerWidth)
  }

  lastIssue: Issue;
  private mockPMStuff() {

    if (!this.mockIssueDevice) {
      this.mockIssueDevice = this.dataService.getRandomDevice();
      this.lastIssue = MockDataService.createIssues(this.mockIssueDevice)[0];
      this.lastIssue.issue_date = Date.now();
      this.lastIssue.state = false;
      this.pmService.addIssue(this.mockIssueDevice, this.lastIssue)
    } else {
      this.pmService.resolveIssue(this.mockIssueDevice, this.lastIssue);
      this.mockIssueDevice = undefined;
    }
  }

// @HostListener('window:resize', ['$event'])
  // onResize(event){
  //   AppComponent.toggleNav(event.target.innerWidth)
  // }

  // static toggleNav(width : number) {
  //   let nav1 = document.getElementById("nav-button");
  //   let nav2 = document.getElementById("nav-wrap");
  //   if (width < 1144){
  //     nav1.style.display = null;
  //     nav2.style.display = 'none';
  //   } else {
  //     nav1.style.display = 'none';
  //     nav2.style.display = null;
  //   }
  // }

}
