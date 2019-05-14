import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material";
import {MockDataService} from "../services/mock-data.service";
import {Container} from "../../model/Container";

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {

  containers: Container[];

  constructor(
    private mockDataService: MockDataService,
  ) { }

  window = window;

  selectedService: string;

  services: {icon: string, name: string}[] = [
    {"icon":'android', "name":'Autonomous Carrier Robot Service'},
    {"icon":'assignment_returned', "name":'Storage Service'},
    {"icon":'send', "name":'Delivery Service'},
    {"icon":'highlight', "name":'Environment Condition Stabilizer Service'},
    {"icon":'scatter_plot', "name":'Material Provider Service'},
    {"icon":'shopping_cart', "name":'Procurement Service'},
  ];

  ngOnInit() {
    this.getMockData();
  }

  private getMockData() {
    this.mockDataService.getContainer()
      .subscribe(data => {
        this.containers = data.container;
      });
  }

  searchForProduct(value: any) {

  }

  serviceSelected(service: string){
    this.selectedService = service;
    this.sideNav2.close()
  }

  openContainerService() {
    this.selectedService = "Container service";
    this.sideNav2.open()
  }

  deviceSort: string[] = ["Name", "Date", "Device type", "On/Off"];
  deviceSortSelected: String = "On/Off";

  @ViewChild('snav1') sideNav: MatSidenav;
  @ViewChild('snav2') sideNav2: MatSidenav;
  backDropClicked() {
    if (this.sideNav.opened && window.innerWidth < 1578)
      this.sideNav.close();

    if (this.sideNav2.opened && window.innerWidth < 1248)
      this.sideNav2.close();
  }

  deviceFilter: String = "";

  /**
   * Sets the device filter string
   * @param filterString
   */
  filterDevices(filterString: string) {
    this.deviceFilter = filterString;
  }

  labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
  data = [300, 500, 100];


}
