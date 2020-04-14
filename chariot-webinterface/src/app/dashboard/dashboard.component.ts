import {Component, OnInit, SimpleChange} from '@angular/core';
import {DataHandlingService} from "../services/data-handling.service";
import {Floor} from "../../model/floor";
import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {Issue} from "../../model/issue";
import {ChartOptions, ChartType} from "chart.js";
import {Color, Label, MultiDataSet, SingleDataSet} from "ng2-charts";
import {Product} from "../../model/Product";
import {Container} from "../../model/Container";
import {DeviceGroup} from '../../model/deviceGroup';
import {Metadata} from "../../model/Metadata";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  floors: Floor[] = [];        // Holds the fetched data of the floors
  locations: Location[] = [];  // Holds the fetched data of the locations
  devices: Device[] = [];      // Holds the fetched data of the devices

  issueList: Issue[] = [];
  issueDeviceMap: Map<Issue, Device> = new Map();

  products: Product[] = [];

  containers: Container[] = [];

  metadata: Metadata;

  public static clickedDoughnutPiece: {value: number, name: string};

  public classReference = DashboardComponent;

  public static onDevices: number = 0;
  public static idleDevices: number = 0;
  public static brokenDevices: number = 0;
  public static fullDeviceAmount: number = 0;
  public displayDounat = false;

  constructor(private dataService: DataHandlingService) {
    // Receive updates on data change events
    dataService.getDataNotification().subscribe(next => {
      this.initDashboard();
    });
  }

  ngOnChanges(change: SimpleChange) {
    console.log(change);
  }

  ngOnInit() {
    this.getData();
    this.initDashboard();

    console.log(this.metadata)
  }

  initDashboard() {
    if(this.devices == undefined || this.devices.length == 0)
      return;

    // this.issueList = this.devices.map(d => {
    //   d.issues.forEach(i => {
    //     this.issueDeviceMap.set(i, d);
    //   });
    //   return d.issues;
    // })
    //   .reduce((previousValue, currentValue) => currentValue.concat(previousValue))
    //   .sort((a, b) => b.issue_date - a.issue_date);

    console.log("ISSUE LIST", this.issueList);

    this.classReference.onDevices = this.devices.reduce((prev, curr) => {
      if(curr.hasOwnProperty('properties')) {
        let statusProp = curr.properties.find(s => s.key == "status");
        if(statusProp && statusProp.hasOwnProperty('value'))
          return statusProp.value ? prev + 1 : prev ;
      }
      return prev;
    }, 0);
    this.classReference.idleDevices = this.devices.reduce((prev, curr) => {
      if(curr.hasOwnProperty('properties')) {
        let statusProp = curr.properties.find(s => s.key == "status");
        if(statusProp && statusProp.hasOwnProperty('value'))
          return !statusProp.value && curr.hasIssue() == 0 ? prev + 1 : prev ;
      }
      return prev;
    }, 0);
    this.classReference.brokenDevices = this.devices.reduce((prev, curr) => curr.hasIssue() > 0 ? prev + 1 : prev, 0);

    this.classReference.fullDeviceAmount = this.classReference.onDevices + this.classReference.idleDevices + this.classReference.brokenDevices;
    // Count all devices
    this.doughnutChartData = [
      this.classReference.onDevices, this.classReference.idleDevices, this.classReference.brokenDevices
    ];
    this.classReference.clickedDoughnutPiece = {value: Math.round(this.classReference.onDevices / this.classReference.fullDeviceAmount * 1000)/10, name: "Running"};
    this.displayDounat = true;
  }

  getData(): void {
    this.dataService.getFloor()
      .subscribe(data => {
        this.floors = data.floors;
        this.locations = data.locations;
        this.devices = data.devices;
      });
    // console.log("floors", this.floors);
    // console.log("locations", this.locations);
    // console.log("devices", this.devices);
    this.dataService.getProducts()
      .subscribe( data => {
        this.products = data.products;
      });
    this.dataService.getContainer()
      .subscribe(data => {
        this.containers = data.container;
      });
    this.dataService.getIssues()
      .subscribe( data => {
        this.issueList = data.issues.sort((a, b) => b.issue_date - a.issue_date);
      });
    this.dataService.getMetadata()
      .subscribe(data => {
        this.metadata = data.metaData;
      });
  }

  changeDevicePowerState(device: Device, state: boolean) {
    let property = device.properties.find(s => s.key === "status");
    property.value = state;
  }

  public doughnutChartOptions: ChartOptions = {
    responsive: true,
    onClick (event?: MouseEvent, activeElements?: Array<{}>) {
      if(activeElements[0] == null)
        return;
      console.log(this.clickedDoughnutPiece);
      switch (activeElements[0]["_index"]) {
        case 0:
          DashboardComponent.clickedDoughnutPiece =
            {
              value: Math.round(DashboardComponent.onDevices / DashboardComponent.fullDeviceAmount * 1000)/10,
              name: "Running"
            };
          break;
        case 1:
          DashboardComponent.clickedDoughnutPiece =
            {
              value: Math.round(DashboardComponent.idleDevices / DashboardComponent.fullDeviceAmount * 1000)/10,
              name: "Idle"
            };
          break;
        case 2:
          DashboardComponent.clickedDoughnutPiece =
            {
              value: Math.round(DashboardComponent.brokenDevices / DashboardComponent.fullDeviceAmount * 1000)/10,
              name: "Defect"
            };
          break;
      }
    },
    legend: {
      display: false,
      position: "bottom",
      fullWidth: false,
      labels: {
        boxWidth: 12,
        padding: 20,
        usePointStyle: true
      }
    },
    cutoutPercentage: 70,
    // elements : {
    //   arc : {
    //     borderColor: '#d53a4a',
    //   }
    // }
  };

  public doughnutChartLabels: Label[] = ['Running', 'Idle', 'Defect'];
  public doughnutChartData: SingleDataSet = [
    1, 2, 3
  ];
  public doughnutChartType: ChartType = 'doughnut';
  doughnutChartColor: Color[] = [
    {
      backgroundColor: [
        '#2b72e6',
        '#e9ac49',
        '#d53a4a',
      ],
      // borderWidth: [0,0,10]
    },
  ];
}
