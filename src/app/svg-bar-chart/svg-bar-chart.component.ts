import { Component, ElementRef, OnInit } from '@angular/core';
import * as d3 from 'd3'; //not using the d3 service cause d3-request is not available there but needed in this example.
import {
  Selection, BaseType, D3, D3Service
} from 'd3-ng2-service';


@Component({
  selector: 'app-svg-bar-chart',
  templateUrl: './svg-bar-chart.component.html',
  styleUrls: ['./svg-bar-chart.component.css']
})
export class SvgBarChartComponent implements OnInit {

  private d3: D3;
  private parentNativeElement: any;

  constructor(elementRef: ElementRef, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = elementRef.nativeElement;
  }

  ngOnInit() {
    var width = 420,
    barHeight = 20;
    let bar: Selection<BaseType, any, BaseType, undefined>;

    var x = this.d3.scaleLinear()
    .range([0, width]);

    var chart = this.d3.select(".chart")
    .attr("width", width);


    d3.tsv("/assets/data/svg-bar-chart-data.tsv", type, (error, data) => {

      x.domain([0, this.d3.max(data, (d) => d.value)]);

      chart.attr("height", barHeight * data.length);

      bar = chart.selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", (d, i) => "translate(0," + i * barHeight + ")");

      bar.append("rect")
      .attr("width", (d) => x(d.value))
      .attr("height", barHeight - 1);

      bar.append("text")
      .attr("x", (d) => x(d.value) - 3)
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text((d)=> d.value );

    });

    function type(d) {
      d.value = +d.value; // coerce to number
      return d;
    }
  }

}
