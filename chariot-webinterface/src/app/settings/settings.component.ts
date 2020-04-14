import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {Settings, SettingsEntry} from "../../model/settings";
import {DataHandlingService} from "../services/data-handling.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @ViewChild('snav1', {static: false}) sideNav: MatSidenav;

  selectedSite: { icon: string, name: string, settingsEntry: SettingsEntry[] };
  window = window;

  settings: Settings;

  sites: { icon: string, name: string, settingsEntry: SettingsEntry[] }[] = [];

  constructor(private dataService: DataHandlingService) {
  }

  backDropClicked() {
    if (this.sideNav.opened && window.innerWidth < 1578)
      this.sideNav.close();
  }

  ngOnInit() {
    this.getSettings();
    this.sites = [
      {icon: "settings", name: "General", settingsEntry: this.settings.general},
      {icon: "location_on", name: "Devices", settingsEntry: this.settings.devices},
      {icon: "home", name: "Warehouse", settingsEntry: this.settings.warehouse},
      {icon: "linear_scale", name: "Product", settingsEntry: this.settings.product},
      {icon: "warning", name: "Maintenance", settingsEntry: this.settings.maintenance},
      {icon: "build", name: "Testing", settingsEntry: null}
    ];
    this.selectedSite = this.sites[0];
  }

  selectSite(site: { icon: string, name: string, settingsEntry: SettingsEntry[] }) {
    this.selectedSite = site;
  }

  private getSettings() {
    this.dataService.getSettings().subscribe(data =>
      this.settings = data.settings
    )
  }
}
