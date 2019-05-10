import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {

  constructor() { }

  window = window;

  containerServices: string[] = [
    'Autonomous Carrier Robot Service',
    'Storage Service',
    'Delivery Service',
    'Environment Condition Stabilizer Service',
    'Material Provider Service',
    'Procurement Service',
  ];

  ngOnInit() {
  }

  searchForProduct(value: any) {

  }
}
