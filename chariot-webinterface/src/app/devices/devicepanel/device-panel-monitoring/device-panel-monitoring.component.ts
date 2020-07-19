import {Component, Input, OnInit, SimpleChanges, OnDestroy} from '@angular/core';

import {Property} from '../../../../model/device';
import {RestService} from '../../../services/rest.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-device-panel-monitoring',
  templateUrl: './device-panel-monitoring.component.html',
  styleUrls: [
    './device-panel-monitoring.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelMonitoringComponent implements OnInit {

  @Input() property: Property;
  @Input() name: string;
  @Input() height: number;
  dataAmount: number = 0;

  useDatesAsTimestamps: boolean = true;
  dataRangeOptionsData: string[] = [
      'Only New',
      '1 Minute', '5 Minutes', '10 Minutes', '15 Minutes', '30 Minutes',
      '1 Hour', '2 Hours', '3 Hours', '6 Hours', '12 Hours',
      '1 Day', '2 Days', '3 Days',
      '1 Week', '2 Weeks', '3 Weeks',
      '1 Month', '2 Months', '1 Year',
      'All Time'
    ];
  selectedVisibility: string = '1 Minute';

  dataRangeOptionsValues: string[] = [
    'Only New',
    '10', '20', '30', '50', '80',
    '100', '150', '200', '300', '400',
    '500', '800', '1000',
    '2000', '3000',
    'All Time'
  ];

  visibleData: { y: number, x: number }[] = [];

  private oneSecond: number = 1_000;
  private oneMinute: number = 60_000;
  private oneHour: number = 3_600_000;
  private oneDay: number = 86_400_000;
  private oneWeek: number = 604_800_000;
  private oneMonth: number = 2_419_200_000;
  private oneYear: number = 29_030_400_000;
  private subscription: Subscription;

  constructor(private restService: RestService) {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if (this.property != null && this.property.url != undefined) {

      this.restService.getHistoryData(this.property.url).subscribe(regData => {
        console.log(regData['value']);
        if (regData.hasOwnProperty("value")) {
          this.property.data = regData['value'];
        }
        this.filterData(true);
      });
    } else {
      this.filterData(true);
    }
  }

  ngOnInit() {
    if (!this.name) this.name = "Device Monitoring";
    if (!this.height) this.height = 380;


    if (this.property.updateListener) {
      this.subscription = this.property.updateListener.subscribe(data => {
          // console.log(data);
          if (this.getCurrentData)
            return this.visibleData.push(data);
        }
      );
    }

    this.filterData(true);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private getSelectedVisibility(visibility: string): number {
    const currentDate = Date.now();
    const indicator = visibility.slice(0, visibility.indexOf(' '));
    // console.log(indicator, currentDate, visibility);
    if (visibility.indexOf('Only New') != -1)
      return currentDate;
    else if (visibility.indexOf('Minute') != -1) {
      return currentDate - this.oneMinute * Number(indicator);
    } else if (visibility.indexOf('Hour') != -1) {
      return currentDate - this.oneHour * Number(indicator);
    } else if (visibility.indexOf('Today') != -1) {
      return currentDate - this.oneDay;
    } else if (visibility.indexOf('Day') != -1) {
      return currentDate - this.oneDay * Number(indicator);
    } else if (visibility.indexOf('Week') != -1) {
      return currentDate - this.oneWeek * Number(indicator);
    } else if (visibility.indexOf('Month') != -1) {
      return currentDate - this.oneMonth * Number(indicator);
    } else if (visibility.indexOf('1 Year') != -1) {
      return currentDate - this.oneYear * Number(indicator);
    }
    return 0;
  }

  private filterData(searchForData: boolean = false) {
    console.log("Filter data: Search for data - " + searchForData);

    if (this.property.data == undefined || this.property.data.length == 0) {
      this.visibleData = [];
      return
    }

    // If the data received doesnt use unix time stamp dont filter for selected date
    if (this.property.data[this.property.data.length - 1].x < 1500000000000) {
      if (this.useDatesAsTimestamps){
        this.useDatesAsTimestamps = false;
        this.selectedVisibility = this.dataRangeOptionsValues[3];
      }

      let length = this.property.data.length;
      if(this.selectedVisibility == 'Only New')
         this.visibleData = [];
      else if(this.selectedVisibility == 'All Time')
        this.visibleData = this.property.data;
      else
        this.visibleData = this.property.data.slice(length - +this.selectedVisibility, length);
      return;
    }

    this.useDatesAsTimestamps = true;

    if (searchForData) {
      let index = 0;
      let foundAmount = 0;
      let foundVisibility = 0;
      do {
        this.selectedVisibility = this.dataRangeOptionsData[index];
        let value = this.getSelectedVisibility(this.selectedVisibility);

        this.visibleData = this.property.data.filter(dataPoint => dataPoint.x > value);
        if (this.visibleData.length >= 5) {
          this.selectedVisibility = this.dataRangeOptionsData[index];
          this.dataAmount = this.visibleData.length;
          break;
        } else {
          // If more data has been found take that as the new return if no data above 5 is found
          if (this.visibleData.length > foundAmount) {
            console.log("new Found max " + this.visibleData.length);
            foundVisibility = index;
            foundAmount = this.visibleData.length;
          }

          index++;
          if (index >= this.dataRangeOptionsData.length) {
            console.log("No data found take first found max: " + this.dataRangeOptionsData[foundVisibility]);
            this.selectedVisibility = this.dataRangeOptionsData[foundVisibility];
            this.dataAmount = foundAmount;
            break;
          }
        }
      } while (true);
    } else {
      let value = this.getSelectedVisibility(this.selectedVisibility);
      console.log("Filter with value: " + value);
      this.visibleData = this.property.data.filter(dataPoint => dataPoint.x > value);
    }

    // this.visibleData.reverse();
  }

  showMoreData() {
    let index = 0;
    if (!this.useDatesAsTimestamps)
      index = this.dataRangeOptionsValues.indexOf(this.selectedVisibility);
    else
      index = this.dataRangeOptionsData.indexOf(this.selectedVisibility);

    if (index > 0) {
      if (!this.useDatesAsTimestamps)
        this.selectedVisibility = this.dataRangeOptionsValues[index - 1];
      else
        this.selectedVisibility = this.dataRangeOptionsData[index - 1];

      this.filterData(false)
    }
  }

  showLessData() {
    let index = 0;
    if (!this.useDatesAsTimestamps)
      index = this.dataRangeOptionsValues.indexOf(this.selectedVisibility);
    else
      index = this.dataRangeOptionsData.indexOf(this.selectedVisibility);


    if (this.useDatesAsTimestamps && index < this.dataRangeOptionsData.length - 1
      || !this.useDatesAsTimestamps && index < this.dataRangeOptionsValues.length - 1) {

      if (!this.useDatesAsTimestamps)
        this.selectedVisibility = this.dataRangeOptionsValues[index + 1];
      else
        this.selectedVisibility = this.dataRangeOptionsData[index + 1];

      this.filterData(false)
    }
  }

  getCurrentData: boolean = true;

  getRealtimeData() {
    this.getCurrentData = true;
  }

  stopDataFlow() {
    this.getCurrentData = false;
  }

  updateLocalData($event: { x: number, y: number }) {
    this.property.data.push($event);
  }
}
