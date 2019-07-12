import {Component, OnInit, Input, Output, SimpleChanges, SimpleChange} from '@angular/core';

import { Color, BaseChartDirective, Label } from 'ng2-charts';
import {Device} from "../../../../model/device";
import {DeviceUpdateService} from '../../../services/device-update.service';

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
  currentTopic = 'exampleData' + [1, 2 ,3][Math.round(Math.random() * 3)];
  dataAmount: number = 0;


  visibleDataPossibilitiesNumbers: number[] = [];
  visibleDataPossibilities: string[] =
    [
      'Only New',
      '1 Minute', '5 Minutes', '10 Minutes', '15 Minutes', '30 Minutes',
      '1 Hour', '2 Hours', '3 Hours', '6 Hours', '12 Hours',
      'Today', '2 Days', '3 Days',
      '1 Week', '2 Weeks', '3 Weeks',
      '1 Month', '2 Months', '1 Year',
      'All Time'
    ];
  selectedVisibility: string = 'Today';

  visibleData: { y: number, x: number }[] = [];

  private oneMinute: number =     60_000;
  private oneHour: number =       3_600_000;
  private oneDay: number =        86_400_000;
  private oneWeek: number =       604_800_000;
  private oneMonth: number =      2_419_200_000;
  private oneYear: number =       29_030_400_000;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.visibleDataPossibilitiesNumbers);
    // console.log(this.device.data);
    this.filterData();
    this.currentTopic = 'exampleData' + [1, 2 ,3][Math.round(Math.random() * 3)];
  }

  ngOnInit() {
    for(let element of this.visibleDataPossibilities) {
      this.visibleDataPossibilitiesNumbers.push(this.getSelectedVisibility(element))
    }
    // for( let element of this.visibleDataPossibilities) {
    //   let index = this.visibleDataPossibilities.indexOf(element);
    //   console.log(index, element, this.visibleDataPossibilitiesNumbers[index])
    // }
    this.filterData();
  }

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

  private filterData() {
    if(this.visibleDataPossibilitiesNumbers.length == 0)
      return;
    const index = this.visibleDataPossibilities.indexOf(this.selectedVisibility);
    const value = this.visibleDataPossibilitiesNumbers[index];
    this.visibleData = this.device.data.filter(dataPoint => dataPoint.x > value )
  }

  private showMoreData() {
    let index = this.visibleDataPossibilities.indexOf(this.selectedVisibility);
    if (index > 0){
      this.selectedVisibility = this.visibleDataPossibilities[index - 1];
      this.filterData()
    }
  }

  private showLessData() {
    let index = this.visibleDataPossibilities.indexOf(this.selectedVisibility);
    if (index < this.visibleDataPossibilities.length - 1) {
      this.selectedVisibility = this.visibleDataPossibilities[index + 1];
      this.filterData()
    }
  }

  getCurrentData : boolean = true;

  getRealtimeData() {
    this.getCurrentData = true;
    this.currentTopic = 'exampleData' + [1, 2 ,3][Math.round(Math.random() * 3)];
  }

  stopDataFlow() {
    this.getCurrentData = false;
    this.currentTopic = '';
  }
}
