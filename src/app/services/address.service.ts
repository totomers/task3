import { Injectable } from '@angular/core';
import { ADDRESSES } from '../data-variables';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor() {}

  getHomeAddress() {
    return new google.maps.LatLng(ADDRESSES.home.lat, ADDRESSES.home.long);
  }
  getWorkAddress() {
    return new google.maps.LatLng(ADDRESSES.work.lat, ADDRESSES.work.long);
  }
}
