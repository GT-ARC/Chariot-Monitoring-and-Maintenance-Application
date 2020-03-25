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

  dataRangeOptions: string[] =
    [
      'Only New',
      '1 Minute', '5 Minutes', '10 Minutes', '15 Minutes', '30 Minutes',
      '1 Hour', '2 Hours', '3 Hours', '6 Hours', '12 Hours',
      '1 Day', '2 Days', '3 Days',
      '1 Week', '2 Weeks', '3 Weeks',
      '1 Month', '2 Months', '1 Year',
      'All Time'
    ];
  selectedVisibility: string = '1 Minute';

  visibleData: { y: number, x: number }[] = [];

  private oneSecond: number = 1_000;
  private oneMinute: number = 60_000;
  private oneHour: number = 3_600_000;
  private oneDay: number = 86_400_000;
  private oneWeek: number = 604_800_000;
  private oneMonth: number = 2_419_200_000;
  private oneYear: number = 29_030_400_000;
  private dataFilterThreshold: number;
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

    // for( let element of this.dataRangeOptions) {
    //   let index = this.dataRangeOptions.indexOf(element);
    //   console.log(index, element, this.dataRangeValues[index])
    // }
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
    // console.log("Filter data: Search for data - " + searchForData);

    if (this.property.data == undefined || this.property.data.length == 0) {
      this.visibleData = [];
      return
    }

    // If the data received doesnt use unix time stamp dont filter for selected date
    if (this.property.data[this.property.data.length - 1].x < 1500000000000) {
      this.visibleData = this.property.data;
      return;
    }


    if (searchForData) {
      let index = 0;
      let foundAmount = 0;
      let foundVisibility = 0;
      do {
        let value = this.getSelectedVisibility(this.selectedVisibility);
        this.dataFilterThreshold = value;
        this.visibleData = this.property.data.filter(dataPoint => dataPoint.x > value);
        if (this.visibleData.length < 5 && index < this.dataRangeOptions.length - 1) {
          index++;
          this.selectedVisibility = this.dataRangeOptions[index];
        } else {
          // console.log("Filter found: " + this.selectedVisibility + " with " + this.visibleData.length);
          if (index >= this.dataRangeOptions.length - 1) {
            this.selectedVisibility = this.dataRangeOptions[foundVisibility];
          }
          break;
        }
        if (this.visibleData.length > foundAmount) {
          foundVisibility = index - 1;
          foundAmount = this.visibleData.length;
        }
      } while (true);
    } else {
      let value = this.getSelectedVisibility(this.selectedVisibility);
      console.log("Filter with value: " + value);
      this.dataFilterThreshold = value;
      this.visibleData = this.property.data.filter(dataPoint => dataPoint.x > value);
    }

    // this.visibleData.reverse();
  }

  showMoreData() {
    let index = this.dataRangeOptions.indexOf(this.selectedVisibility);
    if (index > 0) {
      this.selectedVisibility = this.dataRangeOptions[index - 1];
      this.filterData(false)
    }
  }

  showLessData() {
    let index = this.dataRangeOptions.indexOf(this.selectedVisibility);
    if (index < this.dataRangeOptions.length - 1) {
      this.selectedVisibility = this.dataRangeOptions[index + 1];
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
