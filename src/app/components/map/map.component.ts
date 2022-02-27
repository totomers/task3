import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {} from 'googlemaps';
import { ADDRESSES } from 'src/app/data-variables';
import { MapService } from 'src/app/services/map.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  // @ViewChild('map', { static: false }) mapElement: ElementRef;
  // @ViewChild('search', { static: false }) searchElement: ElementRef;
  @ViewChild('infowindowContent') infowindowContent: ElementRef;
  @ViewChild('placeName') placeName: ElementRef;
  @ViewChild('placeAddress') placeAddress: ElementRef;

  isDirectionsBarToggled: boolean = false;
  map: google.maps.Map;
  currentPlace: google.maps.places.PlaceResult | null;
  marker: google.maps.Marker;
  constructor(private mapService: MapService) {}
  ngOnInit(): void {
    const mapHTMLDiv = document.getElementById('mapDiv');
    this.mapService.setMap(mapHTMLDiv!);
    const infoWindowHTMLDiv = document.getElementById('infoWindowDiv');
    this.mapService.setInfoWindow(infoWindowHTMLDiv!);
  }

  resetMap() {
    this.mapService.resetMap();
  }
  toggleDirectionsBar() {
    this.isDirectionsBarToggled = this.isDirectionsBarToggled ? false : true;
  }

  calculateAndDisplayRoute() {
    this.mapService.calculateAndDisplayRoute(google.maps.TravelMode.BICYCLING);
  }
}
