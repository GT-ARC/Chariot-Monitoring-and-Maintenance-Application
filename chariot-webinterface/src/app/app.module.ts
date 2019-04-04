import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatIconModule } from "@angular/material/icon";

import { NgxGaugeModule } from 'ngx-gauge';
import { ChartsModule } from 'ng2-charts';

import { FlexLayoutModule } from '@angular/flex-layout';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DevicesComponent } from './devices/devices.component';
import { DevicepanelComponent } from './devices/devicepanel/devicepanel.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ProcessFlowComponent } from './process-flow/process-flow.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SettingsComponent } from './settings/settings.component';
import { MatButtonModule, MatCardModule, MatDividerModule, MatMenuModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { OverlayModule } from "@angular/cdk/overlay";
import { DeviceCardComponent } from './components/device-card/device-card.component';
import { IssueCardComponent } from './components/issue-card/issue-card.component';
import { DevicePanelSwitchComponent } from './devices/devicepanel/device-panel-switch/device-panel-switch.component';
import { DevicePanelPowerComponent } from './devices/devicepanel/device-panel-power/device-panel-power.component';
import { DevicePanelIdleTimeComponent } from './devices/devicepanel/device-panel-idle-time/device-panel-idle-time.component';
import { DevicePanelInfoComponent } from './devices/devicepanel/device-panel-info/device-panel-info.component';
import { DevicePanelIssueHistoryComponent } from './devices/devicepanel/device-panel-issue-history/device-panel-issue-history.component';
import { DevicePanelMonitoringComponent } from './devices/devicepanel/device-panel-monitoring/device-panel-monitoring.component';
import { WarehouseMapComponent } from './components/warehouse-map/warehouse-map.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DevicepanelComponent,
    WarehouseComponent,
    ProcessFlowComponent,
    MaintenanceComponent,
    SettingsComponent,
    DevicesComponent,
    DeviceCardComponent,
    IssueCardComponent,
    DevicePanelSwitchComponent,
    DevicePanelPowerComponent,
    DevicePanelIdleTimeComponent,
    DevicePanelInfoComponent,
    DevicePanelIssueHistoryComponent,
    DevicePanelMonitoringComponent,
    WarehouseMapComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    OverlayModule,
    AppRoutingModule,
    MatIconModule,
    NgxGaugeModule,
    ChartsModule,
    FlexLayoutModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
