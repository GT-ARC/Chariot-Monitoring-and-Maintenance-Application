import {Component, OnInit} from '@angular/core';
import {RestService} from '../services/rest.service';
import {DeviceUpdateService} from '../services/device-update.service';
import {AgentUpdateService} from '../services/agent-update.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  mapping: {deviceID : String, agentID: String} [] = [];

  text: string = 'Example Text';
  json: string = '{\n\t"property": 5\n}';

  constructor(private restService: RestService,
              private agentUpdateService: AgentUpdateService) {
  }

  ngOnInit() {
    this.restService.getDeviceMapping().subscribe(data => {
      this.mapping = data;
    });
  }

  sendToDevice(deviceID: string) {
    this.agentUpdateService.sendUpdate(deviceID, "test-property", 5);
  }
}
