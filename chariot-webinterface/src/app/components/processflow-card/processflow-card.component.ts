import {Component, Input, OnInit} from '@angular/core';
import {ProductProcess} from "../../../model/productProcess";

@Component({
  selector: 'app-processflow-card',
  templateUrl: './processflow-card.component.html',
  styleUrls: ['./processflow-card.component.css']
})
export class ProcessflowCardComponent implements OnInit {

  @Input() process: ProductProcess;
  @Input() selectedProcess: ProductProcess;

  constructor() { }

  ngOnInit() {
  }

}
