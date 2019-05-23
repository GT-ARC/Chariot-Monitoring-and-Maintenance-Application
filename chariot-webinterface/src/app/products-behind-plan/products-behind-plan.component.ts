import {Component, OnInit, } from '@angular/core';
import {ProductProcess} from "../../model/productProcess";
import {MockDataService} from "../services/mock-data.service";
import {Metadata} from "../../model/Metadata";
import {MatSliderChange} from "@angular/material";

@Component({
  selector: 'app-products-behind-plan',
  templateUrl: './products-behind-plan.component.html',
  styleUrls: ['./products-behind-plan.component.css']
})
export class ProductsBehindPlanComponent implements OnInit {

  allProducts: ProductProcess[];
  productsBehindPlan: ProductProcess[];

  metadata : Metadata;

  currentDate: number = new Date().getDate();

  amountPBP: number;
  amountPBPToday: number;
  averagePBP: number;
  maxPBP: number;

  constructor(private mockDataService: MockDataService) {
  }

  getMockData(): void {
    this.mockDataService.getProcess()
      .subscribe( data => {
        this.allProducts = data.process;
      });
    this.mockDataService.getMetaData().subscribe(data => {
      this.metadata = data.metaData;
    })
  }

  ngOnInit() {
    const isToday = (someDate: Date) => {
      const today = new Date();
      return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
    };

    this.getMockData();
    this.productsBehindPlan = this.allProducts.filter(prod => prod.deliveryDate < this.currentDate);

    this.amountPBP = this.productsBehindPlan.length;
    this.amountPBPToday = this.productsBehindPlan.filter(prod => isToday(new Date(prod.deliveryDate))).length;
    this.averagePBP = this.productsBehindPlan.reduce((prev, curr) => prev + (this.currentDate - curr.deliveryDate), 0) / this.amountPBP;
    this.maxPBP = this.productsBehindPlan.reduce((prev, curr) => curr.deliveryDate > prev ? curr.deliveryDate : prev, 0);

    this.doMatComponentStyling();
  }

  doMatComponentStyling() {
    let slider = document.getElementsByClassName("mat-slider-track-wrapper").item(0);
    slider.setAttribute("style", "height: 5px");

    let sliderThumb = document.getElementsByClassName("mat-slider-thumb").item(0);
    sliderThumb.setAttribute("style", "height: 25px; width: 25px; bottom: -14px; right: -14px;")
  }

  filterProducts(value: any) {
    
  }

  behindPlanFilter($event: MatSliderChange) {
    
  }
}
