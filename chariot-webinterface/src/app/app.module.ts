import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatIconModule } from "@angular/material/icon";

import { NgxGaugeModule } from 'ngx-gauge';
import { ChartsModule } from 'ng2-charts';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DevicesComponent } from './devices/devices.component';
import { DevicepanelComponent } from './devices/devicepanel/devicepanel.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ProcessFlowComponent } from './process-flow/process-flow.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SettingsComponent } from './settings/settings.component';
import { MatButtonModule, MatCardModule, MatDividerModule, MatMenuModule } from "@angular/material";
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {OverlayModule} from "@angular/cdk/overlay";

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
