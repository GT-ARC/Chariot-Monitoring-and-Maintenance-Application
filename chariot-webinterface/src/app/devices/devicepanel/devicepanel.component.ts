import {Component, OnInit, Input, Output, SimpleChanges, SimpleChange} from '@angular/core';

import {EventEmitter} from '@angular/core';

import {Device} from '../../../model/device';
import {log} from 'util';


@Component({
  selector: 'app-devicepanel',
  templateUrl: './devicepanel.component.html',
  styleUrls: [
    './devicepanel.component.css'
  ]
})
export class DevicepanelComponent implements OnInit {

  @Input() device: Device;
  @Output() uploaded = new EventEmitter<{ device: Device, state: any }>();
  area : String;
  public issueState: boolean;

  ngOnChanges(changes: SimpleChanges) {
    this.issueState = this.device.issues.reduce((acc, curr) => acc && curr.state, true);
    this.area = this.getMdArea();
  }

  constructor() {
  }

  ngOnInit() {
  }

  emitDeviceProperty(property: string, state: any) {
    if (property == 'device_power') {
      this.uploaded.emit({device: this.device, state});
    } else {
      // TODO use the agent service to send the update too the respective device
      console.log(property, state);
      console.log(this.device.properties.find(value => value.name == property));
    }
  }

  getMdArea() : string {
    let propAmount = this.device.properties.length;

    let get1er = function(i : number) {
      return " a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + i + " ";
    };

    let get2er = function(i : number) {
      return " a" + i + " " + "a" + i + " " + "a" + i + " " + "a" + (i+1) + " " + "a" + (i+1) + " " + "a" + (i+1) + " ";
    };

    let get3er = function(i : number) {
      return " a" + i + " " + "a" + i + " " + "a" + (i+1) + " " + "a" + (i+1) + " " + "a" + (i+2) + " " + "a" + (i+2) + " ";
    };

    let index = 0;
    let retString = "";
    while (index < propAmount) {
      let leftProperties = propAmount - index;
      if(retString != "") retString += "|";

      let selectedAmount = leftProperties;
      let breakIt = true;
      if (selectedAmount > 3) {
        selectedAmount = Math.floor((Math.random() * ((3 - 1) + 1)) + 1);
        breakIt = false;
      }

      if(selectedAmount == 1) {
        retString += get1er(index);
        index += 1;
        if(breakIt) break;
      }
      else if(selectedAmount == 2) {
        retString += get2er(index);
        index += 2;
        if(breakIt) break
      }
      else if(selectedAmount == 3) {
        retString += get3er(index);
        index += 3;
        if(breakIt) break
      }
    }
    return retString;

    // // Handle the smaller cases hard coded
    // if(propAmount == 1) return "a0 a0 a0 a0 a0 a0";
    // else if(propAmount == 2) return "a0 a0 a0 a1 a1 a1";
    // else if(propAmount == 3) return "a0 a0 a0 a1 a1 a1 | a2 a2 a2 a2 a2 a2";
    // else if(propAmount == 4) return "a0 a0 a0 a1 a1 a1 | a2 a2 a2 a3 a3 a3";
    // else if(propAmount == 5) return "a0 a0 a1 a1 a2 a2 | a3 a3 a3 a4 a4 a4";
    // else if(propAmount == 6) return "a0 a0 a1 a1 a2 a2 | a3 a3 a3 a4 a4 a4 | a5 a5 a5 a5 a5 a5";




  }

  getStyleOfCard(index: number) {

    if (this.device.properties.length == 4) {
      return '450px';
    }

    let currentSegment = this.device.properties.slice(Math.floor(index / 3), 3);
    if (currentSegment.length == 3) {
      return '300px';
    } else if (currentSegment.length == 2) {
      return '450px';
    } else {
      return '900px';
    }
  }

}
