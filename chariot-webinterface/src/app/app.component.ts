import {Component, HostListener, ViewChild} from '@angular/core';
import {MockDataService} from "./services/mock-data.service";
import {Location as Locl} from "@angular/common";
import {log} from "util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chariot webinterface';

  window = window;
  path: string;

  sites: { route: string, icon: string, name: string }[] = [
    {route: "/devices", icon: "location_on", name: "Devices"},
    {route: "/warehouse", icon: "home", name: "Warehouse"},
    {route: "/process_flow", icon: "linear_scale", name: "Process "},
    {route: "/maintenance", icon: "warning", name: "Maintenance"},
    {route: "/settings", icon: "settings", name: "Settings"},
  ];

  constructor(
    private locationService: Locl
  ) {
  }

  ngOnInit() {
    this.path = this.locationService.path();
    AppComponent.toggleNav(window.innerWidth)
  }



  @HostListener('window:resize', ['$event'])
  onResize(event){
    AppComponent.toggleNav(event.target.innerWidth)
  }

  static toggleNav(width : number) {
    let nav1 = document.getElementById("nav-button");
    let nav2 = document.getElementById("nav-wrap");
    log(width, nav1);
    if (width < 1061){
      nav1.style.display = null;
      nav2.style.display = 'none';
    } else {
      nav1.style.display = 'none';
      nav2.style.display = null;
    }
  }

}
