import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HtmlBarChartComponent } from './html-bar-chart/html-bar-chart.component';
import { SvgBarChartComponent } from './svg-bar-chart/svg-bar-chart.component';
import { VerticalBarChartComponent } from './vertical-bar-chart/vertical-bar-chart.component';
import {D3GmapsComponent} from "./d3-gmaps/d3-gmaps.component";
const routes: Routes = [
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'html-bar-chart',  component: HtmlBarChartComponent },
  { path: 'svg-bar-chart',  component: SvgBarChartComponent },
  { path: 'vertical-bar-chart',  component: VerticalBarChartComponent },
  { path: 'd3-gmaps',  component: D3GmapsComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
