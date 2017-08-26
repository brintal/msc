import {Component, ElementRef, OnInit, ViewEncapsulation} from '@angular/core';
import {Http} from '@angular/http';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {ArtifactImagesService} from "../../shared/artifact-images.service";
import {Location} from "../../shared/location.model";
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
  private artifactImagesService: ArtifactImagesService;
  private map: L.Map;

  constructor(elementRef: ElementRef, http: Http, artifactImagesService: ArtifactImagesService) {
    this.http = http;
    this.parentNativeElement = elementRef.nativeElement;
    this.artifactImagesService = artifactImagesService;
  }

  ngOnInit() {
    this.map = L.map('mapid');
    this.map.setView([48.208043, 16.368739], 13);

    this.createBackgroundLayer().addTo(this.map);
    this.createWatercolorLayer().addTo(this.map);

    this.loadDataToMap();
  }

  private loadDataToMap() {
    this.artifactImagesService.getAll().subscribe((data => this.createClusters(data)));
  }

  private createClusters(data: Location[]) {
    let markers = L.markerClusterGroup();
    data.forEach(location => markers.addLayer(this.createMarker(location)));
    this.map.addLayer(markers);
  }

  private createMarker(location: Location): L.Layer {
    let marker = L.marker([location.latitude, location.longitude], {icon: this.createDefaultIcon()});

    // marker.addEventListener("add",
    //   addEvent => {
    //     this.artifactImagesService.fetch(location.id);
    //     this.artifactImagesService.getIconData(location.id)
    //       .subscribe((iconBase64: string) => marker.setIcon(this.createCustomIcon(iconBase64)))
    //   });
    // marker.addEventListener("add",
    //   addEvent => this.artifactImagesService.getImageIcon(location.id)
    //     .subscribe((iconBase64: string) => marker.setIcon(this.createCustomIcon(iconBase64))));
    marker.addEventListener("add",
      addEvent => marker.setIcon(this.createCustomIconFromAsset(location.id)));

    marker.bindPopup((layer: any) => this.createPopup(location), {
      autoPan: true,
      autoPanPaddingTopLeft: new Point(50, 500),
      autoPanPaddingBottomRight: new Point(550, 50)
    });

    return marker;
  }

  private createPopup(location: Location) {
    let el = document.createElement('div');
    this.artifactImagesService.getImage(location.id).subscribe(base64Image => {
      el.innerHTML = "<p>" + location.title + "</p>" + "<a href=\"http://localhost:8080/getFullSizeArtifactImage?id="+location.id+ "\" target=\"_blank\"><img src='data:image/png;base64, " + base64Image + "'/></a>";
    });
    return el;
  }

  private createBackgroundLayer(): L.TileLayer {
    return L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      minZoom: 0,
      maxZoom: 18,
      ext: 'png'
    });
  }

  private createWatercolorLayer(): L.TileLayer {
    return L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
      attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 17,
      opacity: 0.5,
      ext: 'png'
    });
  }

  private createCustomIconFromAsset(id: number): L.Icon {
    return L.icon({
      iconUrl: 'assets/img/artifactIcons/' + id + '.jpg',
      shadowUrl: '/assets/marker-shadow.png',
      iconSize: [30, 30],
      shadowSize: [41, 41],
      iconAnchor: [12, 41],
      popupAnchor: [-170, -34]
    });
  }

  private createCustomIcon(iconBase64: string): L.Icon {
    return L.icon({
      iconUrl: "data:image/png;base64, " + iconBase64,
      shadowUrl: '/assets/marker-shadow.png',
      iconSize: [30, 30],
      shadowSize: [41, 41],
      iconAnchor: [12, 41],
      popupAnchor: [-170, -34]
    });
  }

  private createDefaultIcon(): L.Icon {
    return L.icon({
      iconUrl: '/assets/marker-icon.png',
      shadowUrl: '/assets/marker-shadow.png',
      iconSize: [25, 41],
      shadowSize: [41, 41],
      iconAnchor: [12, 41],
      popupAnchor: [-170, -34]
    });
  }
}
