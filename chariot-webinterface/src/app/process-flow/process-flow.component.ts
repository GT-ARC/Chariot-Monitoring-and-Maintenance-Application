import { Component, OnInit } from '@angular/core';

import {DataHandlingService} from "../services/data-handling.service";
import {Product} from "../../model/Product";
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

  products: Product[] = [];
  visibleProducts: Product[] = [];
  selectedProduct: Product;

  constructor(
    private mockDataService: DataHandlingService,
  ) { }

  ngOnInit() {
    this.getMockData();
    this.visibleProducts = this.products;
    this.selectedProduct = this.products[0];
  }

  newProcessSelected(process: any) {
    this.selectedProduct = process;
  }

  private getMockData() {
    this.mockDataService.getProducts()
      .subscribe(data => {
        this.products = data.products;
      });
  }

  filterProcess(filterString: any) {
    this.visibleProducts = this.products;
    this.visibleProducts.filter(value => value.productName.includes(filterString)
      || value.identifier == filterString);
  }

  sortProcess(sort_point: string) {
    this.processSortSelected = sort_point;
    this.visibleProducts.sort((a, b) => {
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
