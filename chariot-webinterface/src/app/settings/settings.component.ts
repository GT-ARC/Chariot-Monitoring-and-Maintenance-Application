import {Component, OnInit} from '@angular/core';
import {RestService} from '../services/rest.service';
import {DeviceUpdateService} from '../services/device-update.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  text: string = 'Example Text';
  message: string;

  constructor(private restService: RestService,
              private deviceUpdateService: DeviceUpdateService) {
  }

  ngOnInit() {
  }

  subscribeToTopic(text: string) {
    this.deviceUpdateService.subscribeToTopic(text);
    this.deviceUpdateService.dataStream.subscribe(value => {
      console.log(value);
      this.message = value['value']
    });
  }
}
