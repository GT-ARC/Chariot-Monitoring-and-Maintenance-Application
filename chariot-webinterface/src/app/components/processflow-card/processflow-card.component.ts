import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../model/Product";

@Component({
  selector: 'app-processflow-card',
  templateUrl: './processflow-card.component.html',
  styleUrls: ['./processflow-card.component.css']
})
export class ProcessflowCardComponent implements OnInit {

  @Input() process: Product;
  @Input() selectedProcess: Product;

  constructor() { }

  ngOnInit() {
  }

}
