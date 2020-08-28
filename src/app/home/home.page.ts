import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapOptions, latLng, tileLayer, Map } from 'leaflet';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  options: MapOptions;

  constructor() {}

  ngOnInit(): void {
    this.initializeMapOptions();
  }

  onMapReady(map: Map): void {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }

  private initializeMapOptions(): void {
    this.options = {
      center: latLng(63.423294, 10.396328),
      zoom: 12,
      layers: [
        tileLayer(
          'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
          {
            maxZoom: 18,
            attribution: 'Map data © OpenStreetMap contributors'
          })
      ],
    };
  }

}
