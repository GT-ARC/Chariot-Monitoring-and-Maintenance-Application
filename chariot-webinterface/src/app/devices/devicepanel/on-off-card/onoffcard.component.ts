import {Component, Input, OnInit} from '@angular/core';
import {Device} from "../../../../model/device";

@Component({
  selector: 'app-onoffcard',
  templateUrl: './onoffcard.component.html',
  styleUrls: [
    './onoffcard.component.css',
    '../devicepanel.component.css'
  ]
})
export class OnoffcardComponent implements OnInit {

  @Input() device: Device;

  constructor() { }

  ngOnInit() {
  }

}
