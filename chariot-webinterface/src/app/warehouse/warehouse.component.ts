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

  toggleSecondSideNav: boolean = false;

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
    // this.openContainerService();
    // this.containerSelected(this.containers[0]);
  }

  searchForProduct(value: any) {

  }

  selectedContainer: Container = null;

  containerSelected(container: Container) {
    this.selectedContainer = container;
  }

  serviceSelected(service: string){
    this.selectedService = service;
    this.sideNav2.close();
    this.toggleSecondSideNav = false;
  }

  openContainerService() {
    this.selectedService = "Container service";
    this.sideNav2.open();
    this.toggleSecondSideNav = true;
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

  data = [300, 500, 100];

  pieChartColor(container: Container): string {
    let retColor = "black";
    let currentFull = Math.round(container.products.length / container.maxProductStorage * 100);
    if (currentFull > 75) {
      retColor = '#33ab42';
    } else if (currentFull > 50) {
      retColor = '#2b72e6';
    } else if (currentFull > 25) {
      retColor = '#e9ac49';
    } else {
      retColor = '#d53a4a';
    }
    return retColor;
  }
}
