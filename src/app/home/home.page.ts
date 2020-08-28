import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MapOptions, latLng, tileLayer, Map, popup, marker, icon } from 'leaflet';
import { Geolocation } from '@ionic-native/geolocation/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit{

  options: MapOptions;

  constructor(private geolocation: Geolocation) {}

  ngOnInit(): void {
    this.initializeMapOptions();
  }

  ngAfterViewInit(): void {
  }

  onMapReady(map: Map): void {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }

  private initializeMapOptions() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.options = {
        center: latLng(resp.coords.latitude, resp.coords.longitude),
        zoom: 13,
        layers: [
          tileLayer(
            'https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}',
            {
              maxZoom: 18,
              attribution: 'Map data © OpenStreetMap contributors'
          }),
          marker(latLng(resp.coords.latitude, resp.coords.longitude), {
            icon: icon({
              iconSize: [ 25, 41 ],
              iconAnchor: [ 13, 41 ],
              iconUrl: 'assets/marker-icon.png',
              shadowUrl: 'assets/marker-shadow.png'
            })
          })
        ]
      };
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

}
