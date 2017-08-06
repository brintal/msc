import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppRoutingModule } from './app-routing.module';

import { D3Service } from 'd3-ng2-service';

import { AppComponent } from './app.component';
import { HtmlBarChartComponent } from './html-bar-chart/html-bar-chart.component';
import { SvgBarChartComponent } from './svg-bar-chart/svg-bar-chart.component';
import { VerticalBarChartComponent } from './vertical-bar-chart/vertical-bar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HtmlBarChartComponent,
    SvgBarChartComponent,
    VerticalBarChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    D3Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
