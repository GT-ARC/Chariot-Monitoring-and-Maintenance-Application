import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {Property} from '../../../model/device';
import {DevicepanelComponent} from '../../devices/devicepanel/devicepanel.component';

@Component({
  selector: 'app-property-bundle',
  templateUrl: './property-bundle.component.html',
  styleUrls: ['./property-bundle.component.css']
})
export class PropertyBundleComponent implements OnInit {

  @Input() property: Property;
  @Input() selectedProperty: Property;
  propertyBundle: Property[];

  open: boolean = true;

  @Output() uploaded = new EventEmitter<{property: string, state: any}>();
  @Output() selectedPropertyEvent = new EventEmitter<{selectedProperty: Property}>();

  area: string;

  private areaMD: string;
  private areaSD: string;
  private areaXS: string;

  constructor() { }

  ngOnInit() {

    // @ts-ignore
    this.propertyBundle = this.property.value;

    this.areaMD = DevicepanelComponent.getMdArea(this.propertyBundle.length, 1280);
    this.areaSD = DevicepanelComponent.getMdArea(this.propertyBundle.length, 899);
    this.areaXS = DevicepanelComponent.getMdArea(this.propertyBundle.length, 449);
    this.getArea(null);
  }

  send() {
    let retObject = {};

    for(let prop of this.propertyBundle) {
      retObject[prop.key] = prop.value;
    }

    this.uploaded.emit({property: this.property.key, state: retObject});
  }

  currentArea = null;

  @HostListener('window:resize', ['$event'])
  getArea(event) {
    if(window.innerWidth < 500)
      this.currentArea =  this.areaXS;
    else if(window.innerWidth < 900)
      this.currentArea =  this.areaSD;
    else this.currentArea = this.areaMD
  }
}
