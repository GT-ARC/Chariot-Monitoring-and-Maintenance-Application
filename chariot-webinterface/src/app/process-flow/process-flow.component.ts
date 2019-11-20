import { Component, OnInit } from '@angular/core';

import {DataService} from "../services/data.service";
import {ProductProcess} from "../../model/productProcess";
import {log} from "util";

@Component({
  selector: 'app-process-flow',
  templateUrl: './process-flow.component.html',
  styleUrls: ['./process-flow.component.css']
})
export class ProcessFlowComponent implements OnInit {

  window = window;

  processSort: string[] = [
    "Product Process State",
    "Name",
    "Running Time",
    "Total Running Time",
    "ID"
  ];
  processSortSelected: String = "Name";

  processes: ProductProcess[] = [];
  viableProcesses: ProductProcess[] = [];
  selectedProcess: ProductProcess;

  constructor(
    private mockDataService: DataService,
  ) { }

  ngOnInit() {
    this.getMockData();
    this.viableProcesses = this.processes;
    this.selectedProcess = this.processes[0];
  }

  newProcessSelected(process: any) {
    this.selectedProcess = process;
  }

  private getMockData() {
    this.mockDataService.getProcess()
      .subscribe(data => {
        this.processes = data.process;
      });
  }

  filterProcess(filterString: any) {
    this.viableProcesses = this.processes;
    this.viableProcesses.filter(value => value.productName.includes(filterString)
      || value.identifier == filterString);
  }

  sortProcess(sort_point: string) {
    this.processSortSelected = sort_point;
    this.viableProcesses.sort((a, b) => {
      switch (sort_point) {
        case "Product Process State":
          return a.state == b.state ? -1 : 1;
        case "Name":
          return a.productName < b.productName ? -1 : 1;
        case "Running Time":
          return a.getCurrentRunningProcess().running.valueOf() -
            b.getCurrentRunningProcess().running.valueOf();
        case "Total Running Time":
          return a.getTotalRunningTime() - b.getTotalRunningTime();
        case "ID":
          return a.identifier - b.identifier;
      }
    })
  }
}
