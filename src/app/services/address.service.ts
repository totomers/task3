import { Injectable } from '@angular/core';
import { ADDRESSES } from '../data-variables';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor() {}

  getDefaultAddress() {
    return ADDRESSES.home.address;
  }

  getHomeAddressLocation() {
    return new google.maps.LatLng(ADDRESSES.home.lat, ADDRESSES.home.long);
  }
  getWorkAddressLocation() {
    return new google.maps.LatLng(ADDRESSES.work.lat, ADDRESSES.work.long);
  }
}
