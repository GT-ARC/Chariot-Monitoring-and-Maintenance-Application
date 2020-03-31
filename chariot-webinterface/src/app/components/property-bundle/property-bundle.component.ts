import {Component, EventEmitter, HostListener, Input, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Property, PropertyBundle} from '../../../model/device';
import {DevicepanelComponent} from '../../devices/devicepanel/devicepanel.component';
import {AgentUpdateService} from '../../services/agent-update.service';

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

  ngOnChanges(changes: SimpleChanges) {
    this.property = this.propertyBundle.bundledProperty;
    this.getArea(null);
  }

  ngOnInit() {
    // this.property = this.propertyBundle.bundledProperty;
    // this.getArea(null);
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

  /**
   * Relay the data to the device panel
   *
   * @param $event The property changed
   */
  pushData($event: { property: string; state: any }) {
    console.log($event, this.property);
    // If the property is undefined it has to be a the properties and not a bundled property
    if(!this.property) {
      this.uploaded.emit({property: $event.property, state : $event.state});
    }
  }
}
