import { Component,ElementRef, OnInit } from '@angular/core';

import * as d3 from 'd3';
import {D3, D3Service} from "d3-ng2-service";


@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.css']
})
export class VerticalBarChartComponent implements OnInit {

  private d3: D3;
  private parentNativeElement: any;

  constructor(elementRef: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = elementRef.nativeElement;
  }

  ngOnInit() {


    var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.3);

    var y = d3.scaleLinear()
    .range([height, 0]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3.axisLeft(y).ticks(5, "%");

    var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("/assets/data/vertical-bar-chart-data.tsv", type, function(error, data) {
      x.domain(data.map((d) => d.name ));
      y.domain([0, d3.max(data, (d) => d.value)]);

      chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

      chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

      chart.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d)=> x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => (height - y(d.value)))
      .attr("width", x.bandwidth);
    });

    function type(d) {
      d.value = +d.value; // coerce to number
      return d;
    }


  }

}
