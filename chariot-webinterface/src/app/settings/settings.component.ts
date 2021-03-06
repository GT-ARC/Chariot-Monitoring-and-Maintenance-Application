import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {Settings, SettingsEntry} from "../../model/settings";
import {DataHandlingService} from "../services/data-handling.service";
import {Location as Locl} from "@angular/common";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @ViewChild('snav1', {static: false}) sideNav: MatSidenav;

  selectedSite: { icon: string, name: string, settingsEntry: SettingsEntry[] } = undefined;
  window = window;

  settings: Settings;

  sites: { icon: string, name: string, settingsEntry: SettingsEntry[] }[] = [];

  constructor(private dataService: DataHandlingService,
              private locationService: Locl) {
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
    let path = this.locationService.path();
    for (let site of this.sites) {
      if (path.includes(site.name)) {
        this.selectSite(site);
        break
      }
    }
    if(this.selectedSite == undefined)
      this.selectSite(this.sites[0]);
  }

  selectSite(site: { icon: string, name: string, settingsEntry: SettingsEntry[] }) {
    this.locationService.replaceState('/settings/' + site.name);
    this.selectedSite = site;
  }

  private getSettings() {
    this.dataService.getSettings().subscribe(data =>
      this.settings = data.settings
    )
  }
}
