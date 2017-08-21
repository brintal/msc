import {Component, ElementRef, OnInit} from '@angular/core';

import * as d3 from 'd3';

declare var google: any;

@Component({
  selector: 'app-d3-gmaps',
  templateUrl: './d3-gmaps.component.html',
  styleUrls: ['./d3-gmaps.component.css']
})
export class D3GmapsComponent implements OnInit {

  private parentNativeElement: any;

  constructor(elementRef: ElementRef) {
    this.parentNativeElement = elementRef.nativeElement;
  }


  ngOnInit() {

    var map = new google.maps.Map(d3.select("#map").node(), {
      zoom: 8,
      center: new google.maps.LatLng(37.76487, -122.41948),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });

// Load the station data. When the data comes back, create an overlay.
    d3.json("/assets/data/stations.json", function(error, data) {
      if (error) throw error;

      var overlay = new google.maps.OverlayView();

      // Add the container when the overlay is added to the map.
      overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayLayer).append("div")
          .attr("class", "stations");

        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay.draw = function() {
          var projection = this.getProjection(),
            padding = 10;

          var marker = layer.selectAll("svg")
            .data(d3.entries(data))
            .each(transform) // update existing markers
            .enter().append("svg")
            .each(transform)
            .attr("class", "marker");

          // Add a circle.
          marker.append("circle")
            .attr("r", 4.5)
            .attr("cx", padding)
            .attr("cy", padding);

          // Add a label.
          marker.append("text")
            .attr("x", padding + 7)
            .attr("y", padding)
            .attr("dy", ".31em")
            .text(function(d) { return d.key; });

          function transform(d:any) {
            d = new google.maps.LatLng(d.value[1], d.value[0]);
            d = projection.fromLatLngToDivPixel(d);
            return d3.select(this)
              .style("left", (d.x - padding) + "px")
              .style("top", (d.y - padding) + "px");
          }
        };
      };

      // Bind our overlay to the map…
      overlay.setMap(map);
    });

  }

}
