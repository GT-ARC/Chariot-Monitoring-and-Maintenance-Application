import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Color} from "ng2-charts";
import {ChartOptions} from "chart.js";
import {DeviceUpdateService} from '../../services/device-update.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-data-graph',
  templateUrl: './data-graph.component.html',
  styleUrls: ['./data-graph.component.css']
})
export class DataGraphComponent implements OnInit {

  @Input()   data: {
    y: number,
    x: number
  }[];

  @Input() dataAmount: number;
  @Input() topic: string;
  @Input() height: number = 20;
  @Output() dataLength = new EventEmitter<number>();

  constructor(private deviceUpdateService: DeviceUpdateService) { }

  ngOnInit() {
    document.getElementById("chart").setAttribute("height", this.height + "");
    this.dataLength.emit(this.data.length);
  }

  ngOnChanges(changes: SimpleChanges) {
    // if ('dataAmount' in changes && !('data' in changes)){
    //   if (changes['dataAmount'].currentValue == changes['dataAmount'].previousValue - 1){
    //     this.lineChartLabels.shift();
    //     this.lineChartData[0].data.shift();
    //   } else if (changes['dataAmount'].currentValue == changes['dataAmount'].previousValue + 1){
    //     let dataPoint = this.data[this.data.length - this.dataAmount];
    //     this.lineChartLabels.splice(0, 0, this.monthAbrNames[new Date(dataPoint.y).getMonth()] + " " + new Date(dataPoint.y).getDay());
    //     this.lineChartData[0].data.splice(0, 0, dataPoint.x);
    //   } else {
    //     this.lineChartLabels = this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data =>
    //       this.monthAbrNames[new Date(data.y).getMonth()] + " " + new Date(data.y).getDay()
    //     );
    //     this.lineChartData = [
    //       {
    //         data: this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data => data.x),
    //         label: 'History'
    //       }
    //     ];
    //   }
    // }
    if ('data' in changes) {
      if(this.data != undefined) {
        // TODO change label logic
        this.lineChartLabels = this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data => {
          if(data.x > 1500000000000)
            return this.monthAbrNames[new Date(data.x).getMonth()] + " " + new Date(data.x).getDay();
          else
            return data.x;
        });
        this.lineChartData = [
          {
            data: this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data => data.y),
            label: 'History'
          }
        ];
        this.dataLength.emit(this.data.length);
      }
    }
    if('topic' in changes){
      this.deviceUpdateService.unSubscribeOfTopic(changes['topic'].previousValue);
      this.currentDataReceiver = null;
      this.receiveDataStream();
    }
  }

  private currentDataReceiver: Observable<string>;

  private receiveDataStream() {
    if(this.topic != '') {
      console.log("Receive data stream: kafka topic: " + this.topic);
      this.currentDataReceiver = this.deviceUpdateService.subscribeToTopic(this.topic);

      this.currentDataReceiver.subscribe(message => {
        //console.log(message);
        let dataPoint = JSON.parse(message);
        this.data.push({y: dataPoint.y, x: dataPoint.x});
        this.lineChartLabels.push(this.monthAbrNames[new Date(dataPoint.x).getMonth()] + " " + new Date(dataPoint.x).getDay());
        this.lineChartData[0].data.push(dataPoint.y);
        this.dataLength.emit(this.data.length);
      });
    }
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
    }
  ];

  monthAbrNames: string [] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
    'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
  ];
}
