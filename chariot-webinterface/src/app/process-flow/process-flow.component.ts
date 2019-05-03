import { Component, OnInit } from '@angular/core';

import {MockDataService} from "../services/mock-data.service";
import {ProductProcess} from "../../model/productProcess";
import {log} from "util";

@Component({
  selector: 'app-process-flow',
  templateUrl: './process-flow.component.html',
  styleUrls: ['./process-flow.component.css']
})
export class ProcessFlowComponent implements OnInit {

  window = window;

  processSort: string[] = ["ProductProcess state", "Name", "Running time"];
  processSortSelected: String = "Name";

  processes: ProductProcess[] = [];
  selectedProcess: ProductProcess;

  constructor(
    private mockDataService: MockDataService,
  ) { }

  ngOnInit() {
    this.getMockData();
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
    // log(this.processes)
  }

  filterProcess(filterString: any) {

  }
}
