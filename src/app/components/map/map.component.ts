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

  // ngAfterViewInit() {
  // const OFFICE_ADDRESS = new google.maps.LatLng(32.06462, 34.77176);

  // const mapObject = this.map;

  // const options = {
  //   fields: ['formatted_address', 'geometry', 'name'],
  //   strictBounds: false,
  //   types: ['establishment'],
  // };

  // const autocomplete = new google.maps.places.Autocomplete(
  //   this.searchElement?.nativeElement,
  //   options
  // );

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  // autocomplete.bindTo("bounds", this.mapElement?.nativeElement);

  // google.maps.event.addListener(this.map, 'bounds_changed', function () {
  //   //@ts-ignore
  //   autocomplete.bindTo('bounds', mapObject);
  // });

  // const infowindow = new google.maps.InfoWindow();

  // infowindow.setContent(this.infowindowContent.nativeElement);
  // console.log('info window content', this.infowindowContent.nativeElement);

  // const marker = new google.maps.Marker({
  //   map: this.map,
  //   anchorPoint: new google.maps.Point(0, -29),
  // });

  // marker.setPosition(OFFICE_ADDRESS);
  // marker.setVisible(true);

  // autocomplete.addListener('place_changed', () => {
  //   infowindow.close();
  //   marker.setVisible(false);
  //   console.log('place changed event ');

  //   const place = autocomplete.getPlace();

  //   if (!place.geometry || !place.geometry.location) {
  //     // User entered the name of a Place  that was not suggested and
  //     // pressed the Enter key, or the Place Details request failed.
  //     window.alert("No details available for input: '" + place.name + "'");
  //     return;
  //   }

  //   // If the place has a geometry, then present it on a map.
  //   if (place.geometry.viewport) {
  //     this.map.fitBounds(place.geometry.viewport);
  //   } else {
  //     this.map.setCenter(place.geometry.location);
  //     this.map.setZoom(17);
  //   }

  //   marker.setPosition(place.geometry.location);
  //   marker.setVisible(true);
  //   this.placeAddress.nativeElement.textContent = place.icon;
  //   this.placeName.nativeElement.textContent = place.name;
  //   this.placeAddress.nativeElement.textContent = place.formatted_address;
  // infowindow.open(this.map, marker);
  // });
  // }
}
