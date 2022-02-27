import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AddressService } from './address.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly _map = new BehaviorSubject<google.maps.Map | null>(null);
  readonly map$ = this._map.asObservable();
  marker: google.maps.Marker;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  constructor(private addressService: AddressService) {}

  //Initialize a google map object by binding it to an element on the DOM.
  setMap(el: ElementRef) {
    const mapDiv = el?.nativeElement;
    if (!mapDiv) {
      alert('-error finding dom element for map object to bind to-');
    }

    const mapProperties = {
      center: this.addressService.getWorkAddress(),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    const map = new google.maps.Map(mapDiv, mapProperties);
    this.directionsRenderer.setMap(map); // For directions API
    this._map.next(map);
  }

  getMap() {
    return this._map.getValue();
  }

  calculateAndDisplayRoute(
    origin: string,
    destination: string,
    travelMode: google.maps.TravelMode
  ) {
    return this.directionsService.route(
      {
        origin: {
          query: origin,
        },
        destination: {
          query: destination,
        },
        travelMode: travelMode || google.maps.TravelMode.DRIVING,
      },
      (response) => {
        console.log(response);
        return this.directionsRenderer.setDirections(response);
      }
    );
    // .then((response) => {
    //   this.directionsRenderer.setDirections(response);
    // })
    // .catch((e:any) => window.alert("Directions request failed due to " + status));
  }
}
