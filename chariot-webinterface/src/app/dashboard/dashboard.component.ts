import {Component, OnInit} from '@angular/core';
import {MockDataService} from "../services/mock-data.service";
import {Floor} from "../../model/floor";
import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {Issue} from "../../model/issue";
import {ChartOptions, ChartType} from "chart.js";
import {Color, Label, MultiDataSet, SingleDataSet} from "ng2-charts";
import {ProductProcess} from "../../model/productProcess";
import {Container} from "../../model/Container";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  floors: Floor[];        // Holds the fetched data of the floors
  locations: Location[];  // Holds the fetched data of the locations
  devices: Device[];      // Holds the fetched data of the devices

  issueList: Issue[];
  issueDeviceMap: Map<Issue, Device> = new Map();

  products: ProductProcess[];

  containers: Container[];

  constructor(private mockDataService: MockDataService) {
  }

  ngOnInit() {
    this.getMockData();

    this.issueList = this.devices.map(d => {
      d.issues.forEach(i => {
        this.issueDeviceMap.set(i, d);
      });
      return d.issues;
    })
      .reduce((previousValue, currentValue) => currentValue.concat(previousValue))
      .sort((a, b) => b.issue_date - a.issue_date);


    let onDevices = this.devices.reduce((prev, curr) => curr.power_state ? prev + 1 : prev, 0);
    let idleDevices = this.devices.reduce((prev, curr) => !curr.power_state && curr.hasIssue() == 0 ? prev + 1 : prev, 0);
    let brokenDevices = this.devices.reduce((prev, curr) => curr.hasIssue() > 0 ? prev + 1 : prev, 0);

    // Count all devices
    this.doughnutChartData = [
      onDevices, idleDevices, brokenDevices
    ];

    console.log(this.devices);
    console.log(onDevices, idleDevices, brokenDevices);
  }

  getMockData(): void {
    this.mockDataService.getFloor()
      .subscribe(data => {
        this.floors = data.floors;
        this.locations = data.locations;
        this.devices = data.devices;
      });
    this.mockDataService.getProcess()
      .subscribe( data => {
        this.products = data.process;
      });
    this.mockDataService.getContainer()
      .subscribe(data => {
        this.containers = data.container;
      });
  }

  changeDevicePowerState(device: Device, state: boolean) {
    device.power_state = state
  }

  public barChartOptions: ChartOptions = {
    responsive: true,

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
