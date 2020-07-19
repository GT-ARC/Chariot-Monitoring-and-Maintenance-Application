import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material";
import {DataHandlingService} from "../services/data-handling.service";
import {Container} from "../../model/Container";

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css']
})
export class WarehouseComponent implements OnInit {

  containers: Container[];
  visibleContainer: Container[];

  constructor(
    private mockDataService: DataHandlingService,
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
        this.visibleContainer = data.container;
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
    this.selectedContainer = null;
    this.sideNav2.close();
    this.toggleSecondSideNav = false;
  }

  openContainerService() {
    this.selectedService = "Container service";
    this.sideNav2.open();
    this.toggleSecondSideNav = true;
  }

  @ViewChild('snav1', {static: false}) sideNav: MatSidenav;
  @ViewChild('snav2', {static: false}) sideNav2: MatSidenav;
  backDropClicked() {
    if (this.sideNav.opened && window.innerWidth < 1578)
      this.sideNav.close();

    if (this.sideNav2.opened && window.innerWidth < 1248)
      this.sideNav2.close();
  }

  containerFilter: string = "";
  containerSort: string[] = ["Name", "Remaining Storage Space", "Product Amount", "Weight"];
  containerSortSelected: string = "Storage Space";

  /**
   * Sets the container filter string
   * @param filterString
   */
  filterContainer(filterString: string) {
    this.containerFilter = filterString;
    this.createVisibleContainers();
  }

  createVisibleContainers(sortBy?: string) {
    this.visibleContainer = this.containers;
    if(this.containerFilter.length != 0){
      this.visibleContainer = this.containers.filter(c => c.name.includes(this.containerFilter));
    }
    if(sortBy != undefined && sortBy != this.containerSortSelected){
      this.visibleContainer.sort((a, b) => {
        switch (sortBy) {
          case 'Name':
            return a.name < b.name ? -1 : 1;
          case 'Remaining Storage Space':
            let aRss = a.products.length / a.maxProductStorage * 100;
            let bRss = b.products.length / b.maxProductStorage * 100;
            return aRss - bRss;
          case 'Product Amount':
            return a.products.length - b.products.length;
          case 'Weight':
            let aWeight = a.products.reduce((prev, curr) => prev + curr.weight , 0);
            let bWeight = b.products.reduce((prev, curr) => prev + curr.weight , 0);
            return aWeight - bWeight;
        }
      })
    }
  }

  data = [];

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
