import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {HttpClientModule} from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';

import { D3Service } from 'd3-ng2-service';

import { AppComponent } from './app.component';
import { HtmlBarChartComponent } from './html-bar-chart/html-bar-chart.component';
import { SvgBarChartComponent } from './svg-bar-chart/svg-bar-chart.component';
import { VerticalBarChartComponent } from './vertical-bar-chart/vertical-bar-chart.component';
import {D3GmapsComponent} from "./d3-gmaps/d3-gmaps.component";
import {D3LeafletComponent} from "./d3-leaflet/d3-leaflet.component";


// import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    HtmlBarChartComponent,
    SvgBarChartComponent,
    VerticalBarChartComponent,
    D3GmapsComponent,
    D3LeafletComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule
    // ,AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyBYV-WN6EWN4EBpHdq-5tr1x-mfpvFzPy4'
    // })
  ],
  providers: [
    D3Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
