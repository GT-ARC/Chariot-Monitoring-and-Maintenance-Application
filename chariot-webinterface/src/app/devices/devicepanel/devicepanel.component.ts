import {Component, OnInit, Input, Output, SimpleChanges, SimpleChange} from '@angular/core';

import { EventEmitter } from '@angular/core';

import { MatMenuModule} from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {OverlayModule} from '@angular/cdk/overlay';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

import {Location} from "../../../model/location";
import {Device} from "../../../model/device";
import {Floor} from "../../../model/floor";
import {Issue} from "../../../model/issue";

import {DevicesComponent} from "../devices.component"

@Component({
  selector: 'app-devicepanel',
  templateUrl: './devicepanel.component.html',
  styleUrls: [
    './devicepanel.component.css',
    './device_card_css/device-idle-time.component.css',
    './device_card_css/device-info.component.css',
    './device_card_css/device-issue-history.component.css',
    './device_card_css/device-on-off.component.css',
    './device_card_css/device-power.component.css'
  ]
})
export class DevicepanelComponent implements OnInit {

  @Input() device: Device;
  public issueState: boolean;


  ngOnChanges(changes: SimpleChanges) {
      this.lineChartLabels = this.device.data.map(data =>
        this.monthAbrNames[new Date(data.y).getMonth()] + " " + new Date(data.y).getDay()
      ).concat(
        this.device.prediction.map( data =>
          this.monthAbrNames[new Date(data.y).getMonth()] + " " + new Date(data.y).getDay()
        ).slice(1, this.device.prediction.length)
      );
      let predictionData = new Array(this.device.data.length - 1).concat(this.device.prediction);
      this.lineChartData = [
        {
          data: this.device.data.map(data => data.x),
          lineTension: 0,
          label: 'History'
        },
        {
          data: predictionData.map(data => data.x),
          lineTension: 0,
          label: 'Prediction'
        }
      ];

      this.issueState = this.device.issues.reduce((acc, curr) => acc && curr.state, true)
  }


  @Output() uploaded = new EventEmitter<{device: Device, state: boolean}>();

  math = Math;

  monthAbrNames: string [] = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sept", "Oct",
    "Nov", "Dec"
  ];

  constructor() { }

  ngOnInit() {
  }

  getIssues(): any {
    return this.device.issues.sort((a, b) => b.issue_date - a.issue_date).slice(0, 4)
  }

  emitDevicePower(device: Device, state: boolean) {
    this.uploaded.emit({device, state});
  }

  /** Graph data **/
  public lineChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
  };


  public lineChartType = 'line';
  public lineChartLegend = true;
  public lineChartLabels = [];
  public lineChartData = [];
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(48,92,255,0.1)',
      borderColor: 'rgba(48,92,255,1)',
      pointBorderColor: 'rgba(48,92,255,1)',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      pointBackgroundColor: "#fff",
      pointRadius: 3
    },
    {
      backgroundColor: 'rgb(138, 86, 255,0.1)',
      borderColor: 'rgb(138, 86, 255,1)',
      pointBorderColor: 'rgb(138, 86, 255,1)',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(138, 86, 255,0.8)',
      pointBackgroundColor: "#fff",
      pointRadius: 3
    }
  ];

  /** Gauge data **/
  gaugeType = "arch";
  gaugeLabel = "kw";
  gaugeColor = "rgba(41, 114, 230, 1)";
  gaugeThick = 10;
  gaugeCap = "butt";
}
