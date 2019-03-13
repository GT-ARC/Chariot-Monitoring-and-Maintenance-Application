import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {WarehouseComponent} from "./warehouse/warehouse.component";
import {ProcessFlowComponent} from "./process-flow/process-flow.component";
import {MaintenanceComponent} from "./maintenance/maintenance.component";
import {SettingsComponent} from "./settings/settings.component";
import {DevicesComponent} from "./devices/devices.component";

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard',    component: DashboardComponent },
  { path: 'devices',      component: DevicesComponent },
  { path: 'warehouse',    component: WarehouseComponent },
  { path: 'process_flow', component: ProcessFlowComponent },
  { path: 'maintenance',  component: MaintenanceComponent },
  { path: 'settings',  component: SettingsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
