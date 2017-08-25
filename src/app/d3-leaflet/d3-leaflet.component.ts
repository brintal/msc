import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {Observable} from "rxjs/Observable";
import Point = L.Point;

@Component({
  selector: 'app-d3-leaflet',
  templateUrl: './d3-leaflet.component.html',
  styleUrls: ['./d3-leaflet.component.css'],
  encapsulation: ViewEncapsulation.None // without we need shadow piercing like >>> in front of the styles to also have effect on the svg
})
export class D3LeafletComponent implements OnInit {

  private parentNativeElement: any;
  private http: Http;

  constructor(elementRef: ElementRef, http: Http) {
    this.http = http;
    this.parentNativeElement = elementRef.nativeElement;
  }


  ngOnInit() {

    let map: L.Map;
    map = L.map('mapid');
    map.setView([48.208043, 16.368739], 13);

    this.createBackgroundLayer().addTo(map);
    this.createWatercolorLayer().addTo(map);


    this.getAll().subscribe((data: Location[]) => {
      let markers: L.MarkerClusterGroup;
      markers = L.markerClusterGroup();
      data.forEach(location => {

        let marker = L.marker([location.latitude, location.longitude]);

        marker.bindPopup((layer: any) => {
          var el = document.createElement('div');
          this.getImage(location.id).subscribe(base64Image => {
            el.innerHTML = "<p>" + location.title + "</p>" + "<img src='data:image/png;base64, " + base64Image + "'" + "alt='Red dot' />";
          });
          return el;
        }, {autoPan: true, autoPanPaddingTopLeft: new Point(100, 300), autoPanPaddingBottomRight: new Point(600, 50)});

        markers.addLayer(marker);
        // d3.entries(data).forEach(location => L.marker([location.value.latitude, location.value.longitude]).addTo(mymap))
      });

      map.addLayer(markers);

    });
    // d3.json("http://localhost:8080/artifacts", (error, data) => {
    //   if (error) throw error;
    //   let markers: L.MarkerClusterGroup;
    //   markers = L.markerClusterGroup();
    //
    //   d3.entries(data).forEach(location => {
    //
    //     let marker = L.marker([location.value.latitude, location.value.longitude], {icon: this.createDefaultIcon()});
    //
    //     marker.bindPopup((layer: any) => {
    //       var el = document.createElement('div');
    //       el.innerHTML = "<p>" + location.value.title + "</p>";
    //       // "<img src='data:image/png;base64, "+""+"'"+ "alt='Red dot' />";
    //       return el;
    //     });
    //
    //     markers.addLayer(marker);
    //     // d3.entries(data).forEach(location => L.marker([location.value.latitude, location.value.longitude]).addTo(mymap))
    //   });
    //   map.addLayer(markers);
    //
    //
    // });
  }


  private createBackgroundLayer(): L.TileLayer {
    return L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
    });
  }

  private createWatercolorLayer(): L.TileLayer {
    return L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 17,
      opacity: 0.3,
      ext: 'png'
    });
  }

  // public getDataFromBackend() {
  //   return this.http.get("http://localhost:8080/getArtifactImage?id=2893297").map((response: Response) => {
  //     return response.json();
  //   });
  // }

  // public getData() {
  //   this.getDataFromBackend()
  //     .subscribe((data: string) => {
  //       console.log(data)
  //       this.handleData(data);
  //     });
  // }

  public createDefaultIcon(): L.Icon {
    return L.icon({
      iconUrl: '/assets/marker-icon.png',
      shadowUrl: '/assets/marker-shadow.png',
      iconSize: [25, 41],
      shadowSize: [41, 41],
      iconAnchor: [12, 41],
      popupAnchor: [-300, -34]
    });
  }

  private getImage(id: number): Observable<String> {
    let image$ = this.http.get("http://localhost:8080/getArtifactImage?id=" + id)
      .map((response: Response) => response.text());
    return image$;
  }

  private getAll(): Observable<Location[]> {
    let artifacts$ = this.http.get("http://localhost:8080/artifacts")
      .map(mapArtifacts);
    return artifacts$;
  }

  private getHeaders() {
    // I included these headers because otherwise FireFox
    // will request text/html instead of application/json
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }
}

function mapArtifacts(response: Response): Location[] {
  return response.json().map(toArtifact);
}

function toArtifact(r: any): Location {
  let location = <Location>({
    id: r.id,
    title: r.title,
    latitude: r.latitude,
    longitude: r.longitude
  });
  return location;
}

class Location {
  id: number;
  title: string;
  longitude: number;
  latitude: number;

  constructor(id: number, title: string, longitude: number, latitude: number) {
    this.id = id;
    this.title = title;
    this.longitude = longitude;
    this.latitude = latitude;
  }
}
