import {Component, OnInit} from '@angular/core';
import {RestService} from '../services/rest.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  receivedJson: string = 'The received json will appear here';

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    // this.getInitialJson();
  }

  getInitialJson() {
    this.restService.getDeviceData()
      .subscribe((data: any) => this.receivedJson = JSON.stringify(data));
  }

}
