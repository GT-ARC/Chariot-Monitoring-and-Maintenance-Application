import {Component, Input, OnInit} from '@angular/core';
import {Process} from "../../../model/process";

@Component({
  selector: 'app-processflow-card',
  templateUrl: './processflow-card.component.html',
  styleUrls: ['./processflow-card.component.css']
})
export class ProcessflowCardComponent implements OnInit {

  @Input() process: Process;
  @Input() selectedProcess: Process;

  constructor() { }

  ngOnInit() {
  }

}
