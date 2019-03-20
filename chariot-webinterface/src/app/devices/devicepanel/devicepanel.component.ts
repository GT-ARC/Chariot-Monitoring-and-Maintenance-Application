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

  ngOnChanges(changes: SimpleChanges) {
      this.lineChartLabels = this.device.data.map(data => {
        console.log("Data: " + data.y);
        return this.monthAbrNames[new Date(data.y).getMonth()] + " " + new Date(data.y).getDay();
      });
      this.lineChartData = [
        {
          data: this.device.data.map(data => data.x).slice(0, this.device.data.length-4),
          label: 'History'
        },
        {
          data: [null,null,null,null,null,null,null,null,null,null,null,null].concat(
            this.device.data.map(data => data.x).slice(this.device.data.length-5,this.device.data.length)),
          label: 'Prediction'
        }
      ];
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
    return this.device.issues.slice(0, 4)
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
