import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {IndividualProcess, ProductProcess} from "../../../model/productProcess";
import {log} from "util";

@Component({
  selector: 'app-process-flow-main',
  templateUrl: './process-flow-main.component.html',
  styleUrls: ['./process-flow-main.component.css']
})
export class ProcessFlowMainComponent implements OnInit {

  @Input() process: ProductProcess;

  currentProcess: IndividualProcess[] = [];

  constructor() { }

  ngOnInit() {
    this.getCurrentProcessFlow();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getCurrentProcessFlow();
  }

  getCurrentProcessFlow() {
    this.currentProcess = [];
    for (let currProgress of this.process.productFlow){
      if(currProgress.progress > 0 && currProgress.progress < 100) {
        this.currentProcess.push(currProgress);
      }
    }
  }

  stopProcess(currentProcess: IndividualProcess) {
    currentProcess.paused = !currentProcess.paused;
  }
}
