import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {Container} from "../../../model/Container";
import {ChartOptions, ChartType} from "chart.js";
import {Color, Label, SingleDataSet} from "ng2-charts";

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  @Input() container: Container;

  weight: number = 0;

  statusColor: string = 'yellow';

  constructor() { }

  ngOnInit() {
    this.weight = this.container.products.reduce((prev, curr) => prev + curr.weight , 0);
    this.initDoughnutChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.weight = this.container.products.reduce((prev, curr) => prev + curr.weight , 0);
    this.initDoughnutChart();
  }

  initDoughnutChart() {
    let currentFull = Math.round(this.container.products.length / this.container.maxProductStorage * 100);
    this.doughnutChartData = [
      100 - currentFull, currentFull
    ];
    if (currentFull > 75) {
      this.statusColor = '#33ab42';
    } else if (currentFull > 50) {
      this.statusColor = '#2b72e6';
    } else if (currentFull > 25) {
      this.statusColor = '#e9ac49';
    } else {
      this.statusColor = '#d53a4a';
    }

    this.doughnutChartColor = [{
      backgroundColor: [
        '#bdc4d0',
        this.statusColor,
      ],
    }];

  }

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

}
