import {Component, OnInit, } from '@angular/core';
import {ProductProcess} from "../../model/productProcess";
import {DataHandlingService} from "../services/data-handling.service";
import {Metadata} from "../../model/Metadata";
import {MatSliderChange} from "@angular/material";
import {log} from "util";

@Component({
  selector: 'app-products-behind-plan',
  templateUrl: './products-behind-plan.component.html',
  styleUrls: ['./products-behind-plan.component.css']
})
export class ProductsBehindPlanComponent implements OnInit {

  allProducts: ProductProcess[];
  productsBehindPlan: ProductProcess[];

  visibleProducts: ProductProcess[];

  metadata : Metadata;

  currentDate: number = new Date().valueOf();

  amountPBP: number;
  amountPBPToday: number;
  averagePBP: number;
  maxPBP: number;

  constructor(private mockDataService: DataHandlingService) {
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
    this.visibleProducts = this.productsBehindPlan;

    this.amountPBP = this.productsBehindPlan.length;
    this.amountPBPToday = this.productsBehindPlan.filter(prod => isToday(new Date(prod.deliveryDate))).length;
    this.averagePBP = this.productsBehindPlan.reduce((prev, curr) => prev + (this.currentDate - curr.deliveryDate), 0) / this.amountPBP;
    this.maxPBP = this.productsBehindPlan.reduce((prev, curr) => curr.deliveryDate < prev ? curr.deliveryDate : prev, 10000000000000);

    this.doMatComponentStyling();
  }

  doMatComponentStyling() {
    let slider = document.getElementsByClassName("mat-slider-track-wrapper").item(0);
    slider.setAttribute("style", "height: 5px");

    let sliderThumb = document.getElementsByClassName("mat-slider-thumb").item(0);
    sliderThumb.setAttribute("style", "height: 25px; width: 25px; bottom: -14px; right: -14px;")
  }

  productBehindPlanDayFilter: number = 14;
  filterString: any = "";
  selectedCategory: string = "all";

  applyFilter() {
    this.visibleProducts = this.productsBehindPlan;

    this.visibleProducts = this.visibleProducts.filter(value => {
      return (this.currentDate - value.deliveryDate)/(86400000) <= this.productBehindPlanDayFilter + 1;
    });

    if (this.selectedCategory  != 'all') {
      this.visibleProducts = this.visibleProducts.filter(product => {
        return product.category == this.selectedCategory ;
      });
    }

    if(this.filterString != ""){
      this.visibleProducts = this.visibleProducts.filter(product => {
        return product.productName.includes(this.filterString) || product.identifier == this.filterString
      });
    }
  }

  filterPBPUpdate($event: number) {
    this.productBehindPlanDayFilter = $event;
    this.applyFilter();
  }


  filterProducts(filterString: any) {
    this.filterString = filterString;

    this.applyFilter();
  }

  categoryFilter(category: any) {
    this.selectedCategory = category;
    this.applyFilter();
  }

  getDateString(dateNumber: number) {
    let date = new Date(dateNumber);
    let days = Math.floor(dateNumber / 86400000);
    return (days <= 0 ? "" : days + "D ") + date.getHours() + "h " + date.getMinutes() + "m";
  }

  getFontSize(date: number) : string {
    let dateString = this.getDateString(date);

    if(dateString.length >= 9)
      return "32px";

    return "48px"
  }
}
