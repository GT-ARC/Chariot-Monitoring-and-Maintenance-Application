import {Component, OnInit, Input, Output, SimpleChanges, SimpleChange} from '@angular/core';

import { Color, BaseChartDirective, Label } from 'ng2-charts';
import {Device} from "../../../../model/device";

@Component({
  selector: 'app-device-panel-monitoring',
  templateUrl: './device-panel-monitoring.component.html',
  styleUrls: [
    './device-panel-monitoring.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelMonitoringComponent implements OnInit {

  @Input() device: Device;

  constructor() { }

  ngOnInit() {
  }

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

  monthAbrNames: string [] = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

}
