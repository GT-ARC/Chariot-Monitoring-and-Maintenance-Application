import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Color} from "ng2-charts";
import {ChartOptions} from "chart.js";
import {DeviceUpdateService} from '../../services/device-update.service';
import {Observable, Subscription} from 'rxjs';
import {takeWhile, timestamp} from 'rxjs/operators';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-data-graph',
  templateUrl: './data-graph.component.html',
  styleUrls: ['./data-graph.component.css']
})
export class DataGraphComponent implements OnInit {

  internalChange : boolean = false;

  @Input()   data: {
    y: number,
    x: number
  }[];

  @Input() dataAmount: number;
  @Input() topic: string;
  @Input() height: number = 375;
  @Input() selectedVisibility: string = "";
  @Output() dataLength = new EventEmitter<number>();
  @Output() updateData = new EventEmitter<{ x: number, y: number }>();

  constructor(private deviceUpdateService: DeviceUpdateService) { }

  ngOnInit() {
    this.dataLength.emit(this.data.length);
    document.getElementById("chart").setAttribute("height", this.height + "");
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("Changes detected in data graph: ", changes, this.data);
    if ('data' in changes) {
      if(this.data != undefined) {
        this.lineChartLabels = this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data => {
          if(data.x > 1500000000000)
            return this.getEntryLabel(data.x);
          else
            return data.x;
        });
        this.lineChartData = [
          {
            data: this.data.slice(this.data.length - this.dataAmount, this.data.length).map(data => Math.round(data.y * 100) / 100),
            label: 'History'
          }
        ];
        this.dataLength.emit(this.data.length);
      }
    } else if('dataAmount' in changes && this.data && this.data.length != 0) {
        if (this.internalChange) {
          console.log("Skip change");
          this.internalChange = false;
        } else {
          this.addDataPointToGraph(this.data[this.dataAmount - 1]);
        }
    }

    if('topic' in changes){
      if(!environment.mock) {
        if(this.subscription != undefined) this.subscription.unsubscribe();
        this.receiveDataStream();
      }
    }
  }

  private addDataPointToGraph(dataPoint : {x: number, y: number}) {

    if(dataPoint.x > 1500000000000) {
      this.lineChartLabels.push(this.getEntryLabel(Math.round(dataPoint.x)));
      this.lineChartData[0].data.push(Math.round(dataPoint.y * 100) / 100);
    } else {
      this.lineChartLabels.push(dataPoint.x);
      this.lineChartData[0].data.push(Math.round(dataPoint.y * 100) / 100);
    }

    // check if you have to remove old ones
    if (this.selectedVisibility.indexOf('Only New') != -1) {
      if (this.lineChartLabels.length > 5) {
        this.lineChartLabels = this.lineChartLabels.slice(this.lineChartLabels.length - 5, this.lineChartLabels.length);
        this.lineChartData[0].data = this.lineChartData[0].data.slice(this.lineChartData[0].data.length - 5, this.lineChartData[0].data.length);
      }
    } else {
      let lastVisibleTime = this.getSelectedVisibility();
      let dataLength = this.lineChartLabels.length;
      for (let i = this.data.length - dataLength; i < this.data.length; i++) {
        if (!this.data[i] || this.data[i].x > lastVisibleTime) break;
        this.lineChartLabels.splice(0, 1);
        this.lineChartData[0].data.splice(0, 1);
      }
    }
  }

  private subscription: Subscription;
  private currentDataReceiver: Observable<string>;

  private receiveDataStream() {
    if(this.topic != '') {
      this.currentDataReceiver = this.deviceUpdateService.subscribeToTopic(this.topic);

      this.subscription = this.currentDataReceiver.subscribe(message => {
        console.log("data-graph-update");
        let property = JSON.parse(message);

        if(this.topic != undefined) {
          if(property.kafka_topic != this.topic) {
            console.log("received wrong topic: ", property.topic, "!=", this.topic);
            console.log("wrong property", property);
            return;
          }
        }

        console.log(this.data);

        this.internalChange = true;
        this.data.push({y: property.value, x: property.timestamp});
        this.updateData.emit({y: property.value, x: property.timestamp});
        // console.log("Data-Graph", property);

        this.addDataPointToGraph({y: property.value, x: property.timestamp});

        this.dataLength.emit(this.data.length);
      });
    }
  }


  private oneMinute: number =     60_000;
  private oneHour: number =       3_600_000;
  private oneDay: number =        86_400_000;
  private oneWeek: number =       604_800_000;
  private oneMonth: number =      2_419_200_000;
  private oneYear: number =       29_030_400_000;

  getEntryLabel(x: number) {
    let visibility = this.selectedVisibility;

    let xDate = new Date(Math.floor(x));

    if ( visibility.indexOf('Only New') != -1  )
      return xDate.getMinutes() + "m " + xDate.getSeconds() + '.' + xDate.getMilliseconds();
    else if ( visibility.indexOf('Minute') != -1 ) {
      return xDate.getMinutes() + 'm ' + xDate.getSeconds() + "s";
    }
    else if ( visibility.indexOf('Hour') != -1 ) {
      return xDate.getHours() + ":" + xDate.getMinutes() + 'm ';
    }
    else if ( visibility.indexOf('Day') != -1 ) {
      return xDate.getDate() + ' of ' + this.monthAbrNames[xDate.getMonth()];
    }
    else if ( visibility.indexOf('Week') != -1 ) {
      return xDate.getDate() + ' of ' + this.monthAbrNames[xDate.getMonth()];
    }
    else if ( visibility.indexOf('Month') != -1 ) {
      return this.monthAbrNames[xDate.getMonth()];
    }
    else if ( visibility.indexOf('1 Year') != -1 ) {
      return this.monthAbrNames[xDate.getMonth()];
    }
    return xDate.getFullYear();
  }

  private getSelectedVisibility(): number {
    let visibility = this.selectedVisibility;
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
    else if ( visibility.indexOf('1 Day') != -1 ) {
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
    animation: false
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
