import {Component, Input, OnInit} from '@angular/core';
import {SettingsEntry} from "../../../model/settings";
import {DataHandlingService} from "../../services/data-handling.service";

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {

  @Input() name: string;
  @Input() settings: SettingsEntry[];

  constructor(private dataService: DataHandlingService) { }

  ngOnInit() {
    console.log(this.settings)
  }

  settingsStateChanged(entry: SettingsEntry, $event: Event) {
    let state: any = $event.target['value'];
    switch (entry.type) {
      case 'boolean':
        entry.value = state == 'on';
        break;
      default:
        entry.value = state;
    }
    entry.callback(state);
    this.dataService.storeSettings(entry, this.name.toLowerCase());
  }

}
