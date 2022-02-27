import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ADDRESSES } from '../data-variables';
import { AddressService } from './address.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private readonly _map = new BehaviorSubject<google.maps.Map | null>(null);
  readonly map$ = this._map.asObservable();
  searchMarker: google.maps.Marker;
  infoWindow: google.maps.InfoWindow;
  currentPlace: google.maps.places.PlaceResult;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  originAddress: google.maps.LatLng;
  destinationAddress: google.maps.LatLng;
  DEFAULT_MAP_LOCATION: google.maps.LatLng;
  CUSTOM_MAP_STYLE_ID: string = 'd6b0915170f4b0bf';

  constructor(private addressService: AddressService) {
    this.DEFAULT_MAP_LOCATION = this.addressService.getWorkAddress();
  }

  //Initialize a google map object by binding it to an element on the DOM.
  initMap() {}

  setMap(el: HTMLElement) {
    const mapDiv = el;
    if (!mapDiv) {
      alert('-error finding dom element for map object to bind to-');
    }

    const mapProperties = {
      center: this.addressService.getWorkAddress(),
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapId: this.CUSTOM_MAP_STYLE_ID,
    };
    const map = new google.maps.Map(mapDiv, mapProperties);

    this.directionsRenderer.setMap(map); // For directions API
    this.createSearchMarker(map); // create default marker at the maps default position

    this._map.next(map);
  }

  getMap() {
    return this._map.getValue();
  }

  resetMap() {
    const map = this.getMap();
    this.searchMarker.setVisible(false);
    this.changeMapLocation(this.DEFAULT_MAP_LOCATION);
  }

  setInfoWindow(el: HTMLElement) {
    const infowindow = new google.maps.InfoWindow();

    infowindow.setContent(el);
    this.infoWindow = infowindow;
  }

  setAutoCompleteInput(el: HTMLInputElement) {
    if (!el) return;
    //CONFIGURE
    const options = {
      fields: ['formatted_address', 'geometry', 'name'],
      componentRestrictions: { country: 'IL' },

      strictBounds: false,
      types: ['establishment'],
    };
    const inputElement = el;

    //CREATE GOOGLE AUTOCOMPLETE OBJECT & BIND TO DOM INPUT ELEMENT
    const autocomplete = new google.maps.places.Autocomplete(
      inputElement,
      options
    );

    //GET MAP
    const map = this.getMap()!;
    console.log(
      'mapService wants to connect autocomplete object to the MAP OBJECT and to DOM ELEMENT',
      map
    );
    //ADD GOOGLE AUTOCOMPLETE OBJECT TO MAP OBJECT
    google.maps.event.addListener(map, 'bounds_changed', function () {
      //@ts-ignore
      autocomplete.bindTo('bounds', map);
    });

    return autocomplete;
  }

  setSearchInput(el: HTMLInputElement) {
    const autocomplete = this.setAutoCompleteInput(el);
    if (!autocomplete) return;

    //ADD SEARCH FUNCTIONALITY ON DROPDOWN CLICK EVENT
    autocomplete.addListener('place_changed', () => {
      // this.infowindow.close();
      this.searchMarker.setVisible(false);
      const place = autocomplete.getPlace();
      el.value = ''; //feature - reset input value at the end of input place search, when option dropdown option is clicked
      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place  that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.

      if (place.geometry.viewport) {
        this.changeMapBounds(place.geometry.viewport);
      } else {
        this.changeMapLocation(place.geometry.location);
      }

      this.setSearchMarkerPosition(place.geometry.location);

      // this.placeAddress.nativeElement.textContent = place.icon;
      // this.placeName.nativeElement.textContent = place.name;
      // this.placeAddress.nativeElement.textContent = place.formatted_address;

      // this.infoWindow.open(map, this.searchMarker);
    });
  }

  // setInfoWindowDetails(place: google.maps.places.PlaceResult) {

  // }

  changeMapBounds(bounds: google.maps.LatLngBounds) {
    const map = this.getMap()!;
    map.fitBounds(bounds);
  }
  changeMapLocation(location: google.maps.LatLng) {
    const map = this.getMap()!;
    map.setCenter(location);
    map.setZoom(17);
  }

  createSearchMarker(map: google.maps.Map) {
    const marker = new google.maps.Marker({
      map,
      anchorPoint: new google.maps.Point(0, -29),
    });

    marker.setPosition(this.addressService.getWorkAddress());
    marker.setVisible(true);
    this.searchMarker = marker;
  }

  setSearchMarkerPosition(
    latlng: google.maps.LatLng | google.maps.ReadonlyLatLngLiteral | null
  ) {
    this.searchMarker.setPosition(latlng);
    this.searchMarker.setVisible(true);
  }

  setOriginInput(el: HTMLInputElement) {
    const autocomplete = this.setAutoCompleteInput(el);
    if (!autocomplete) return;
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        this.changeMapLocation(place.geometry?.location);
        this.setSearchMarkerPosition(place.geometry.location);
        this.originAddress = place.geometry.location;
      }
    });
  }
  setDestinationInput(el: HTMLInputElement) {
    const autocomplete = this.setAutoCompleteInput(el);
    if (!autocomplete) return;
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        this.changeMapLocation(place.geometry?.location);
        this.setSearchMarkerPosition(place.geometry.location);
        this.destinationAddress = place.geometry.location;
      }
    });
  }

  calculateAndDisplayRoute(travelMode: google.maps.TravelMode) {
    this.searchMarker.setVisible(false);
    return this.directionsService.route(
      {
        origin: {
          location: this.originAddress,
        },
        destination: {
          location: this.destinationAddress,
        },
        travelMode: travelMode || google.maps.TravelMode.DRIVING,
      },
      (response) => {
        console.log(response);
        return this.directionsRenderer.setDirections(response);
      }
    );
  }
}
