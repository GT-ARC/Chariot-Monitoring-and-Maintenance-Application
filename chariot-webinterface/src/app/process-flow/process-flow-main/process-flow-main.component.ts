import {Component, HostListener, Input, OnInit, SimpleChanges} from '@angular/core';
import {IndividualProcess, Product} from '../../../model/Product';
import {ChartOptions, ChartType} from "chart.js";
import {Color, Label, SingleDataSet} from "ng2-charts";
import {strings} from "../../../environments/strings";

@Component({
  selector: 'app-process-flow-main',
  templateUrl: './process-flow-main.component.html',
  styleUrls: ['./process-flow-main.component.css']
})
export class ProcessFlowMainComponent implements OnInit {

  constructor() {
  }

  @Input() process: Product;

  currentProcess: IndividualProcess;

  displayProcessInfo: {
    display: boolean;
    key: string;
    unit?: string;
    value: any;
    size?: number;
    icon?: string;
    errorThreshold?: number;
  }[] = [];

  isFilament = undefined;
  filamentLevel = 0;

  public barChartOptions: ChartOptions = {
    responsive: true,
    legend: {display: false},
    cutoutPercentage: 80,
  };

  public doughnutChartLabels: Label[] = ['Depleted', 'Fillament Level'];
  public doughnutChartData: SingleDataSet = [
    100 - 25, 25
  ];
  public doughnutChartType: ChartType = 'doughnut';
  doughnutChartColor: Color[] = [{
    backgroundColor: [
      '#bdc4d0',
      '#d53a4a',
    ],
  },
  ];

  ngOnInit() {
    this.getCurrentProcessFlow();
    this.initDoughnutChart();

    if (this.currentProcess != null) {
      this.displayProcessInfo = this.currentProcess.properties.filter(value => value.display);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.getCurrentProcessFlow();
    this.initDoughnutChart();
    if (this.currentProcess) {
      this.displayProcessInfo = this.currentProcess.properties.filter(value => value.display);
    }
  }

  getCurrentProcessFlow() {
    for (const currProgress of this.process.productionFlow) {
      if (currProgress.progress > 0 && currProgress.progress < 100) {
        this.currentProcess = currProgress;
        return;
      }
    }
    // If no process is running take the last one with 100 progress
    for (const process of this.process.productionFlow) {
      if (process.progress != 0) { this.currentProcess = process; }
    }
    // If still no is found take the first one
    this.currentProcess = this.process.productionFlow[0];
  }

  stopProcess(currentProcess: IndividualProcess) {
    currentProcess.paused = !currentProcess.paused;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.changeStyleOfFont();
  }

  changeStyleOfFont() {
    const progressCardValues = document.getElementsByClassName('progress-card-value');
    for (let i = 0; i < progressCardValues.length; i++) {
      const element = progressCardValues.item(i);
      if (element.clientWidth == 0) { continue; }
      element.setAttribute('style', 'font-size: ' + 48 + 'px');
      let c = 0;
      while (element.clientWidth > element.parentElement.clientWidth - 32) {
        element.setAttribute('style', 'font-size: ' + (48 - c++) + 'px');
        if (c == 48) {
          break;
        }
      }
    }
  }

  initDoughnutChart() {
    if (this.currentProcess == null || !this.currentProcess.name.includes('Printing')) {return; }

    let filamentLevelProperty = this.currentProcess.properties.find(
        value => value.key == strings.product_process_properties.printing.filament_level);
    if (filamentLevelProperty == undefined) {
      return;
    }
    this.isFilament = true;
    this.filamentLevel = filamentLevelProperty.value;
    this.doughnutChartData = [
      100 - this.filamentLevel, this.filamentLevel
    ];
    if (this.filamentLevel > 75) {
      this.doughnutChartColor = [{
        backgroundColor: [
          '#bdc4d0',
          '#33ab42',
        ],
      },
      ];
    } else if (this.filamentLevel > 50) {
      this.doughnutChartColor = [{
        backgroundColor: [
          '#bdc4d0',
          '#2b72e6',
        ],
      },
      ];
    } else if (this.filamentLevel > 25) {
      this.doughnutChartColor = [{
        backgroundColor: [
          '#bdc4d0',
          '#e9ac49',
        ],
      },
      ];
    } else {
      this.doughnutChartColor = [{
        backgroundColor: [
          '#bdc4d0',
          '#d53a4a',
        ],
      },
      ];
    }
  }

  getProductStatusColor(status: String) {
    if (status == 'Status A') {
      return '#33ab42';
    }
    if (status == 'Status B') {
      return '#2b72e6';
    }
    if (status == 'Status C') {
      return '#e9ac49';
    } else {
      return '#d53a4a';
    }
  }

}
