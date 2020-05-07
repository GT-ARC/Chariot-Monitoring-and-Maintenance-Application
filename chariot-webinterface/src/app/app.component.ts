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
import {environment} from "../environments/environment";
import {Metadata} from "../model/Metadata";
import {Product} from "../model/Product";
import {DeviceParseService} from "./services/parseService/device-parse.service";
import {tryCatch} from "rxjs/internal-compatibility";
import {catchError, retry} from "rxjs/operators";
import {throwError} from "rxjs";
import {Settings} from "../model/settings";
import {settings} from "../environments/default_settings";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chariot webinterface';

  window = window;
  path: string;

  error_icon: string = environment.icons.error;
  warning_icon: string = environment.icons.warning;

  sites: { route: string, icon: string, name: string }[] = [
    {route: "/devices", icon: "location_on", name: "Devices"},
    {route: "/warehouse", icon: "home", name: "Warehouse"},
    {route: "/process_flow", icon: "linear_scale", name: "Product "},
    {route: "/maintenance", icon: "warning", name: "Maintenance"},
    {route: "/settings", icon: "settings", name: "Settings"},
  ];
  sitesReversed = this.sites.reverse();

  mockIssueDevice: Device;
  metaData: Metadata;
  mockMode: boolean;

  constructor(
    private locationService: Locl,
    private pmService: PmNotificationReceiverService,
    private restService: RestService,
    private dataService: DataHandlingService,
    private deviceParseServiceService: DeviceParseService
  ) {
    if (environment.production) {
      console.log = () => {
      };
    }
    this.getData();
    this.mockMode = settings.general.find(ele => ele.name == 'Mock modus').value;
  }

  ngOnInit() {

    // Receive the data from the backend
    if ( settings.general.find(ele => ele.name == 'Mock modus').value) {
      setInterval(_ => this.mockPMStuff(), 30000);
    } else {
      // Get the data from the database
      this.restService.getDeviceData()
        .pipe(catchError(err => this.handleError(err))).subscribe(data => {

          // Parse it into the localy used device data
          let parsedData = this.deviceParseServiceService.parseDeviceData(data as Array<any>);

          // Due to the fact that there is no current floor information
          // everything gets put into the same floor
          let newFloor: Floor = new Floor(
            "MyFloorId",
            'IoT Testbed',
            11,
            parsedData.location,
          );

          console.log("Add new data");
          // Add it to the data handling service which holds the references that all sides have subscribed on
          this.dataService.handleNewFloor(newFloor);
          this.pmService.getIssues();
          if (this.metaData) this.metaData.devicesSynchronised = true;
          console.log(parsedData);
        }
      );

      this.restService.getContainer().subscribe(data => {
        this.dataService.addProducts(data as Array<Product>);
      });
    }

    this.path = this.locationService.path();
    console.log("App: the path" + this.path);
  }

  lastIssue: Issue;

  getData(): void {
    this.dataService.getMetadata()
      .subscribe(data => {
        this.metaData = data.metaData;
      });
  }

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

  handleError(error) {
    this.metaData.errorInGettingData = true;
    this.metaData.devicesSynchronised = true;
    this.metaData.warehouseSynchronised = true;
    this.metaData.issuesSynchronised = true;
    return throwError(error);
  }
}
