import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-device-usage-card',
  templateUrl: './device-usage-card.component.html',
  styleUrls: ['./device-usage-card.component.css']
})
export class DeviceUsageCardComponent implements OnInit {

  @Input() color: string;
  @Input() value: string;

  constructor() { }

  ngOnInit() {
  }

}
