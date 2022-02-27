import { Component, OnInit } from '@angular/core';
import { ADDRESSES } from 'src/app/data-variables';
import { AddressService } from 'src/app/services/address.service';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-directions-bar',
  templateUrl: './directions-bar.component.html',
  styleUrls: ['./directions-bar.component.scss'],
})
export class DirectionsBarComponent implements OnInit {
  constructor(private mapService: MapService) {}
  travelMode: 'BICYCLING' | 'WALKING' | 'DRIVING' = 'BICYCLING';
  originHTML: HTMLInputElement;
  destinationHTML: HTMLInputElement;
  ngOnInit(): void {
    // this.origin = ADDRESSES.home.address;
    // this.destination = ADDRESSES.work.address;

    const originHTMLInput = document.getElementById(
      'origin'
    ) as HTMLInputElement;
    this.originHTML = originHTMLInput;
    const destinationHTMLInput = document.getElementById(
      'destination'
    ) as HTMLInputElement;
    this.destinationHTML = destinationHTMLInput;
    originHTMLInput.value =
      this.mapService.getCurrentPlaceValue()?.formatted_address || '';
    this.mapService.bindOriginInput(originHTMLInput);
    this.mapService.bindDestinationInput(destinationHTMLInput);

    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute(
    travelMode: 'BICYCLING' | 'WALKING' | 'DRIVING' = 'BICYCLING'
  ) {
    this.travelMode = travelMode;
    return this.mapService.calculateAndDisplayRoute(
      google.maps.TravelMode[travelMode]
    );
  }

  reverseDisplayRoute() {
    const temp = this.originHTML.value;
    this.originHTML.value = this.destinationHTML.value;
    this.destinationHTML.value = temp;
    this.mapService.calculateAndDisplayReverseRoute(
      google.maps.TravelMode[this.travelMode]
    );
  }
}
