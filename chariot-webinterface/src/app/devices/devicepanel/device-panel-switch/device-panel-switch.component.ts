import {Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit} from '@angular/core';
import {Device, Property} from '../../../../model/device';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-device-panel-switch',
  templateUrl: './device-panel-switch.component.html',
  styleUrls: [
    './device-panel-switch.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelSwitchComponent implements OnInit {

  @Output() uploaded = new EventEmitter<{property: string, state: any}>();
  cardName: string;

  @Input() property: Property;
  @Input() selectedProperty: Property;

  constructor() { }

  ngOnInit() {
    this.cardName = this.property.name == undefined ? this.property.key : this.property.name;
    // console.log("Switch ", this.property);
  }

  // ngAfterViewInit() {
  //   console.log(" AVER VIEW INIT");
  //   this.element.readOnly = !this.property.writable;
  // }

  emitDevicePower(switchState: any) {
    // console.log(this.property);
    this.uploaded.emit({property: this.property.key, state: switchState});
  }

}
