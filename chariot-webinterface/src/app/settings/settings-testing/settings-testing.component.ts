import { Component, OnInit } from '@angular/core';
import {RestService} from "../../services/rest.service";
import {AgentUpdateService} from "../../services/agent-update.service";

@Component({
  selector: 'app-settings-testing',
  templateUrl: './settings-testing.component.html',
  styleUrls: ['./settings-testing.component.css']
})
export class SettingsTestingComponent implements OnInit {

  mapping: {deviceID : String, agentID: String} [] = [];

  parameter = {
    command: "continues-predict",
    parameter: {
      algorithm: "OCSVM",
      deviceID: "c3cedae8-6143-4421-84aa-32e527c6b04e",
      para: [0.01, 1.5],
      properties: ["velocity", "power_in"],
      database: "predictive_maintenance",
      path: "/app/datafiles/real_motor_data_0320.csv",
      interval: 5.0,
      input: [0.1, 1.0],
      planner: true
    }
  };

  text: string = 'Example Text';
  json: string = '{\n\t"property": 5\n}';


  constructor(private restService: RestService,
              private agentUpdateService: AgentUpdateService) { }

  ngOnInit() {
    this.json = JSON.stringify(this.parameter, null, "\t")

    this.getMapping();
  }

  sendToDevice(deviceID: string) {
    this.agentUpdateService.sendJson(deviceID, this.json);
  }

  getMapping() {
    this.restService.getDeviceMapping().subscribe(data => {
      this.mapping = data;
    });
  }
}
