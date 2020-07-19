import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Property} from '../../../../model/device';
import {strings as envString} from "../../../../environments/strings";

@Component({
  selector: 'app-device-panel-text-field',
  templateUrl: './device-panel-text-field.component.html',
  styleUrls: [
    './device-panel-text-field.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelTextFieldComponent implements OnInit {

  @Input() property: Property;
  @Output() uploaded = new EventEmitter<{property: string, state: any}>();

  strings = envString;

  constructor() { }

  ngOnInit() {
  }

  emitProperty($event: any) {
    if ($event.key == "Enter") {
      this.property.value = $event.target.value;
      this.uploaded.emit({property: this.property.key, state: $event.target.value})
    }
  }
}
