import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {log} from "util";
import {state} from "@angular/animations";

@Component({
  selector: 'app-device-panel-text-field',
  templateUrl: './device-panel-text-field.component.html',
  styleUrls: [
    './device-panel-text-field.component.css',
    '../devicepanel.component.css'
  ]
})
export class DevicePanelTextFieldComponent implements OnInit {

  @Input() property: {
    name: string
    value: {
      value: any;
      unit?: string;
      min_value?: any;
      max_value?: any;
    }
  };

  @Output() uploaded = new EventEmitter<{property: string, state: any}>();

  constructor() { }

  ngOnInit() {
  }

  emitProperty($event: KeyboardEvent) {
    if ($event.key == "Enter") {
      this.property.value.value = $event.target.value;
      this.uploaded.emit({property: this.property.name, state: $event.target.value})
    }
  }
}
