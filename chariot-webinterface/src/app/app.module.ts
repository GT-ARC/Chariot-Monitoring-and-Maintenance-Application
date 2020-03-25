import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatIconModule } from "@angular/material/icon";

import { NgxGaugeModule } from 'ngx-gauge';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
// const config: SocketIoConfig = { url: 'localhost:4444', options: {} };
// const config: SocketIoConfig = { url: 'http://chariot-main.dai-lab.de:4444', options: {} };

import { ChartsModule } from 'ng2-charts';

import { FlexLayoutModule } from '@angular/flex-layout';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DevicesComponent } from './devices/devices.component';
import { DevicepanelComponent } from './devices/devicepanel/devicepanel.component';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { ProcessFlowComponent } from './process-flow/process-flow.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SettingsComponent } from './settings/settings.component';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatFormFieldModule, MatInputModule,
  MatMenuModule, MatProgressBarModule,
  MatSliderModule
} from '@angular/material';

import {MatTooltipModule} from '@angular/material/tooltip';

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
import { DevicePanelSliderComponent } from './devices/devicepanel/device-panel-slider/device-panel-slider.component';
import { DevicePanelTextFieldComponent } from './devices/devicepanel/device-panel-text-field/device-panel-text-field.component';

import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavButtonComponent } from './components/sidenav-button/sidenav-button.component';
import { ProcessflowCardComponent } from './components/processflow-card/processflow-card.component';
import { ProcessFlowMainComponent } from './process-flow/process-flow-main/process-flow-main.component';
import {InlineSVGModule} from "ng-inline-svg";
import {HttpClientModule} from "@angular/common/http";
import {ProgressBarModule} from "angular-progress-bar";
import { ContainerComponent } from './warehouse/container/container.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductsBehindPlanComponent } from './products-behind-plan/products-behind-plan.component';
import { PredictionGraphComponent } from './components/prediction-graph/prediction-graph.component';
import { DeviceUsageCardComponent } from './components/device-usage-card/device-usage-card.component';
import { ClickableTextComponent } from './components/clickable-text/clickable-text.component';
import {FormsModule} from '@angular/forms';
import { DataGraphComponent } from './components/data-graph/data-graph.component';
import { DeviceGroupCardComponent } from './components/device-group-card/device-group-card.component';
import { PropertyBundleComponent } from './components/property-bundle/property-bundle.component';
import { NotifierModule } from 'angular-notifier';

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
    DevicePanelSliderComponent,
    DevicePanelTextFieldComponent,
    SidenavButtonComponent,
    ProcessflowCardComponent,
    ProcessFlowMainComponent,
    ContainerComponent,
    ProductListComponent,
    ProductsBehindPlanComponent,
    PredictionGraphComponent,
    DeviceUsageCardComponent,
    ClickableTextComponent,
    DataGraphComponent,
    DeviceGroupCardComponent,
    PropertyBundleComponent,
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
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    HttpClientModule,
    NotifierModule,
    InlineSVGModule.forRoot(),
    MatProgressBarModule,
    ProgressBarModule,
    FormsModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
