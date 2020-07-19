import {Component, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Color} from "ng2-charts";
import {MatSidenav} from "@angular/material";

@Component({
  selector: 'app-prediction-graph',
  templateUrl: './prediction-graph.component.html',
  styleUrls: ['./prediction-graph.component.css']
})
export class PredictionGraphComponent implements OnInit {

  @Input()   data: {
    y: number,
    x: number
  }[];

  @Input() prediction: {
    y: number,
    x: number
  }[];

  @Input() height: number = 20;

  constructor() { }

  ngOnInit() {
    document.getElementById("chart").setAttribute("height", this.height + "");
  }

  ngOnChanges(changes: SimpleChanges) {
    this.lineChartLabels = this.data.map(data =>
      this.monthAbrNames[new Date(data.x).getMonth()] + " " + new Date(data.x).getDay()
    ).concat(
      this.prediction.map( data =>
        this.monthAbrNames[new Date(data.x).getMonth()] + " " + new Date(data.x).getDay()
      ).slice(1, this.prediction.length)
    );
    let predictionData = new Array(this.data.length - 1).concat(this.prediction);
    this.lineChartData = [
      {
        data: this.data.map(data => data.y),
        lineTension: 0,
        label: 'History'
      },
      {
        data: predictionData.map(data => data.y),
        lineTension: 0,
        label: 'Prediction'
      }
    ];
  }


  /** Graph data **/
  public lineChartOptions = {
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
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
      pointBackgroundColor: '#fff',
      pointRadius: 3
    },
    {
      backgroundColor: 'rgb(138, 86, 255,0.1)',
      borderColor: 'rgb(138, 86, 255,1)',
      pointBorderColor: 'rgb(138, 86, 255,1)',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgb(138, 86, 255,0.8)',
      pointBackgroundColor: '#fff',
      pointRadius: 3
    }
  ];

  monthAbrNames: string [] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];

}
