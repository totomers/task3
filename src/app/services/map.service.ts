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
  private readonly _currentPlace =
    new BehaviorSubject<google.maps.places.PlaceResult | null>(null);
  readonly currentPlace$ = this._currentPlace.asObservable();
  // _cuurentPlace: google.maps.places.PlaceResult;
  searchMarker: google.maps.Marker;
  infoWindow: google.maps.InfoWindow;
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  DEFAULT_MAP_LOCATION: google.maps.LatLng;
  originAddress: google.maps.places.PlaceResult;
  destinationAddress: google.maps.places.PlaceResult;
  CUSTOM_MAP_STYLE_ID: string = 'd6b0915170f4b0bf';

  constructor(private addressService: AddressService) {
    this.DEFAULT_MAP_LOCATION = this.addressService.getWorkAddressLocation();
    this.setOriginFromQuery(ADDRESSES.home.address);
    this.setDestinationFromQuery(ADDRESSES.work.address);
    // this.setOriginFromQuery(ADDRESSES.work.address, this.destinationAddress);
    // console.log(this.originAddress.name);
  }

  //Initialize a google map object by binding it to an element on the DOM.

  setMap(el: HTMLElement) {
    const mapDiv = el;
    if (!mapDiv) {
      alert('-error finding dom element for map object to bind to-');
    }

    const mapProperties = {
      center: this.addressService.getWorkAddressLocation(),
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

  setCurrentPlace(currentPlace: google.maps.places.PlaceResult) {
    this._currentPlace.next(currentPlace);
  }

  getCurrentPlace() {
    return this.currentPlace$;
  }
  getCurrentPlaceValue() {
    return this._currentPlace.getValue();
  }

  //NEED TO FINISH INFO WINDOW
  setInfoWindow(el: HTMLElement) {
    const infowindow = new google.maps.InfoWindow();

    infowindow.setContent(el);
    this.infoWindow = infowindow;
  }

  setAutoCompleteInput(el: HTMLInputElement) {
    if (!el) return;
    //CONFIGURE

    const options: google.maps.places.AutocompleteOptions = {
      fields: ['formatted_address', 'geometry', 'name'],
      componentRestrictions: { country: 'IL' },
      strictBounds: false,
      types: ['establishment', 'address'],
    };
    const inputElement = el;

    //CREATE GOOGLE AUTOCOMPLETE OBJECT & BIND TO DOM INPUT ELEMENT
    const autocomplete = new google.maps.places.Autocomplete(
      inputElement,
      options
    );
    // const currentPlace = this.getCurrentPlaceValue();
    // autocomplete.set('place', this.originAddress);

    //GET MAP
    const map = this.getMap()!;
    //ADD GOOGLE AUTOCOMPLETE OBJECT TO MAP OBJECT
    google.maps.event.addListener(map, 'bounds_changed', function () {
      //@ts-ignore
      autocomplete.bindTo('bounds', map);
    });

    return autocomplete;
  }

  bindSearchInput(el: HTMLInputElement) {
    console.log('binding serach input');
    const autocomplete = this.setAutoCompleteInput(el);
    console.log('autocomplete:', autocomplete);
    if (!autocomplete) return;
    console.log('i am defined', autocomplete);
    //ADD SEARCH FUNCTIONALITY ON DROPDOWN CLICK EVENT
    autocomplete.addListener('place_changed', () => {
      // this.infowindow.close();
      console.log('place changed');
      this.searchMarker.setVisible(false);
      const place = autocomplete.getPlace();
      this.setCurrentPlace(place);
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
        this.originAddress = place; //for directions feature to automatically start directions panel with the last searched location
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

    marker.setPosition(this.addressService.getWorkAddressLocation());
    marker.setVisible(true);
    this.searchMarker = marker;
  }

  setSearchMarkerPosition(
    latlng: google.maps.LatLng | google.maps.ReadonlyLatLngLiteral | null
  ) {
    this.searchMarker.setPosition(latlng);
    this.searchMarker.setVisible(true);
  }

  bindOriginInput(el: HTMLInputElement) {
    const autocomplete = this.setAutoCompleteInput(el);
    if (!autocomplete) return;
    el.value = this.originAddress.formatted_address!;
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        this.changeMapLocation(place.geometry?.location);
        this.setSearchMarkerPosition(place.geometry.location);
        this.originAddress = place;
      }
    });
  }
  bindDestinationInput(el: HTMLInputElement) {
    const autocomplete = this.setAutoCompleteInput(el);
    if (!autocomplete) return;
    el.value = this.destinationAddress.formatted_address!;
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        this.changeMapLocation(place.geometry?.location);
        this.setSearchMarkerPosition(place.geometry.location);
        this.destinationAddress = place;
      }
    });
  }

  calculateAndDisplayRoute(travelMode: google.maps.TravelMode) {
    this.searchMarker.setVisible(false);
    return this.directionsService.route(
      {
        origin: {
          location: this.originAddress.geometry?.location,
        },
        destination: {
          location: this.destinationAddress.geometry?.location,
        },
        travelMode: travelMode || google.maps.TravelMode.DRIVING,
      },
      (response) => {
        console.log(response);
        return this.directionsRenderer.setDirections(response);
      }
    );
  }

  calculateAndDisplayReverseRoute(travelMode: google.maps.TravelMode) {
    this.searchMarker.setVisible(false);
    return this.directionsService.route(
      {
        origin: {
          location: this.destinationAddress.geometry?.location,
        },
        destination: {
          location: this.originAddress.geometry?.location,
        },
        travelMode: travelMode || google.maps.TravelMode.BICYCLING,
      },
      (response) => {
        console.log(response);
        return this.directionsRenderer.setDirections(response);
      }
    );
  }

  setOriginFromQuery(queryStr: string) {
    let autocompleteService = new google.maps.places.AutocompleteService();
    let request = { input: queryStr };
    autocompleteService.getPlacePredictions(
      request,
      (predictionsArr, placesServiceStatus) => {
        let placeRequest = { placeId: predictionsArr[0].place_id };
        const map = this.getMap();
        let placeService = new google.maps.places.PlacesService(map!);
        placeService.getDetails(
          placeRequest,
          (placeResult, placeServiceStatus) => {
            this.originAddress = placeResult;
          }
        );
      }
    );
  }
  setDestinationFromQuery(queryStr: string) {
    let autocompleteService = new google.maps.places.AutocompleteService();
    let request = { input: queryStr };
    autocompleteService.getPlacePredictions(
      request,
      (predictionsArr, placesServiceStatus) => {
        let placeRequest = { placeId: predictionsArr[0].place_id };
        const map = this.getMap();
        let placeService = new google.maps.places.PlacesService(map!);
        placeService.getDetails(
          placeRequest,
          (placeResult, placeServiceStatus) => {
            this.destinationAddress = placeResult;
          }
        );
      }
    );
  }
}
