import {Component, Input, OnInit} from '@angular/core';
import {ProductProcess} from "../../../model/productProcess";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  @Input() products: ProductProcess[];

  currentTime: number = new Date().valueOf();

  math = Math;

  tableHead : {name: string, sortIcon: string}[] = [
    {name: 'PRODUCT NAME', sortIcon: 'keyboard_arrow_down'},
    {name: 'PRODUCT ID', sortIcon: 'keyboard_arrow_down'},
    {name: 'STATUS', sortIcon: 'keyboard_arrow_down'},
    {name: 'DELIVERY', sortIcon: 'keyboard_arrow_down'},
    {name: 'BEHIND PLAN', sortIcon: 'keyboard_arrow_down'},
    {name: 'ENERGY USED', sortIcon: 'keyboard_arrow_down'},
  ];

  sortBy(sort: string){
    let direction = this.tableHead.find(value => value.name==sort).sortIcon;
    this.tableHead.find(value => value.name==sort).sortIcon
      = direction == 'keyboard_arrow_down' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
    this.products.sort((a, b) => {
      switch (sort) {
        case 'PRODUCT NAME':
          if(direction.includes("up"))
            return a.productName > b.productName ? 1 : -1;
          else
            return a.productName < b.productName ? 1 : -1;
        case 'PRODUCT ID':
          if(direction.includes("up"))
            return a.identifier - b.identifier;
          else
            return b.identifier - a.identifier;
        case 'STATUS':
          if(direction.includes("up"))
            return a.status > b.status ? 1 : -1;
          else
            return a.status < b.status ? 1 : -1;
        case 'DELIVERY':
          if(direction.includes("up"))
            return a.deliveryDate - b.deliveryDate;
          else
            return b.deliveryDate - a.deliveryDate;
        case 'BEHIND PLAN':
          if(direction.includes("up"))
            return (this.currentTime - a.deliveryDate) - (this.currentTime - b.deliveryDate);
          else
            return (this.currentTime - b.deliveryDate) - (this.currentTime - a.deliveryDate);
        case 'ENERGY USED':
          if(direction.includes("up"))
            return a.energyUsed - b.energyUsed;
          else
            return b.energyUsed - a.energyUsed;
      }
    })
  }

  getProductStatusColor(status: string) {
    if(status == "Status A")
      return '#33ab42';
    if(status == "Status B")
      return '#2b72e6';
    if (status == "Status C")
      return '#e9ac49';
    else
      return '#d53a4a';
  }

  constructor() { }

  ngOnInit() {
  }
}
