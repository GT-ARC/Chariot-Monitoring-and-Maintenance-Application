import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Color} from "ng2-charts";
import {ChartOptions} from "chart.js";
import {DeviceUpdateService} from '../../services/device-update.service';
import {Observable, Subscription} from 'rxjs';
import {takeWhile, timestamp} from 'rxjs/operators';

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
  @Input() selectedVisibility: string = "";

  constructor(private deviceUpdateService: DeviceUpdateService) { }

  ngOnInit() {
    document.getElementById("chart").setAttribute("height", this.height + "");
    this.dataLength.emit(this.data.length);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('data' in changes) {
      if(this.data != undefined) {
        // TODO change label logic
        this.lineChartLabels = this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data => {
          if(data.x > 1500000000000)
            return this.monthAbrNames[new Date(Math.floor(data.x)).getMonth()] + " " + new Date(Math.floor(data.x)).getDay();
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
      if(this.subscription != undefined) this.subscription.unsubscribe();
      this.receiveDataStream();
    }
  }

  private subscription: Subscription;
  private currentDataReceiver: Observable<string>;

  private receiveDataStream() {
    if(this.topic != '') {
      console.log("Receive data stream: kafka topic: " + this.topic);
      this.currentDataReceiver = this.deviceUpdateService.subscribeToTopic(this.topic);

      this.subscription = this.currentDataReceiver.subscribe(message => {
        //console.log(message);
        let property = JSON.parse(JSON.parse(message));

        if(this.topic != undefined) {
          if(property.kafka_topic != this.topic) {
            console.log("received wrong topic: ", property.topic, "!=", this.topic);
            console.log("wrong property", property);
            return;
          }
        }

        // let dataFilter = this.getSelectedVisibility(this.selectedVisibility);
        // for(let i = 0; i < this.data.length; i++) {
        //   let currData = this.data[i];
        //   if(currData.x < dataFilter) {
        //     this.lineChartLabels.slice(this.lineChartLabels.length - 1, 1);
        //     this.lineChartData[0].data.slice(this.lineChartData[0].data.length - 1, 1);
        //   }
        // }

        this.data.push({y: property.value, x: property.timestamp});
        // console.log("Data-Graph", property);
        if(property.timestamp > 1500000000000) {
          this.lineChartLabels.push(this.monthAbrNames[new Date(Math.floor(property.timestamp)).getMonth()] + " " + new Date(Math.floor(property.timestamp)).getDay());
          this.lineChartData[0].data.push(property.value);
        } else {
          this.lineChartLabels.push(property.timestamp);
          this.lineChartData[0].data.push(property.value);
        }

        this.dataLength.emit(this.data.length);
      });
    }
  }


  private oneSecond: number =     1_000;
  private oneMinute: number =     60_000;
  private oneHour: number =       3_600_000;
  private oneDay: number =        86_400_000;
  private oneWeek: number =       604_800_000;
  private oneMonth: number =      2_419_200_000;
  private oneYear: number =       29_030_400_000;
  private dataFilterThreshold: number;

  private getSelectedVisibility(visibility: string): number {
    const currentDate = Date.now();
    const indicator = visibility.slice(0, visibility.indexOf(' '));
    // console.log(indicator, currentDate, visibility);
    if ( visibility.indexOf('Only New') != -1  )
      return currentDate;
    else if ( visibility.indexOf('Minute') != -1 ) {
      return currentDate - this.oneMinute * Number(indicator);
    }
    else if ( visibility.indexOf('Hour') != -1 ) {
      return currentDate - this.oneHour * Number(indicator);
    }
    else if ( visibility.indexOf('Today') != -1 ) {
      return currentDate - this.oneDay;
    }
    else if ( visibility.indexOf('Days') != -1 ) {
      return currentDate - this.oneDay * Number(indicator);
    }
    else if ( visibility.indexOf('Week') != -1 ) {
      return currentDate - this.oneWeek * Number(indicator);
    }
    else if ( visibility.indexOf('Month') != -1 ) {
      return currentDate - this.oneMonth * Number(indicator);
    }
    else if ( visibility.indexOf('1 Year') != -1 ) {
      return currentDate - this.oneYear * Number(indicator);
    }
    return 0;
  }

  /** Graph data **/
  public lineChartOptions = {

    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
    // scales: {
    //   yAxes: [{
    //     ticks: {
    //       beginAtZero: true
    //     }
    //   }]
    // },
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
