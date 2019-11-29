import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Property, PropertyBundle} from '../../../model/device';
import {DevicepanelComponent} from '../../devices/devicepanel/devicepanel.component';

@Component({
  selector: 'app-property-bundle',
  templateUrl: './property-bundle.component.html',
  styleUrls: ['./property-bundle.component.css']
})
export class PropertyBundleComponent implements OnInit {

  @Input() selectedProperty: Property;
  @Input() propertyBundle: PropertyBundle;

  property: Property;

  open: boolean = true;

  @Output() uploaded = new EventEmitter<{property: string, state: any}>();
  @Output() selectedPropertyEvent = new EventEmitter<{selectedProperty: Property}>();

  constructor() { }

  ngOnInit() {

    this.property = this.propertyBundle.bundledProperty;

    this.getArea(null);
  }

  send() {
    let retObject = {};

    for(let prop of this.propertyBundle.properties) {
      retObject[prop.key] = prop.value;
    }

    this.uploaded.emit({property: this.propertyBundle.bundledProperty.key, state: retObject});
  }

  currentArea = null;

  @HostListener('window:resize', ['$event'])
  getArea(event) {
    if(window.innerWidth < 500)
      this.currentArea =  this.propertyBundle.areaXS;
    else if(window.innerWidth < 900)
      this.currentArea =  this.propertyBundle.areaSD;
    else this.currentArea = this.propertyBundle.areaMD
  }
}
