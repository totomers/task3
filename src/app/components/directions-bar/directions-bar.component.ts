import { Component, OnInit } from '@angular/core';
import { ADDRESSES } from 'src/app/data-variables';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-directions-bar',
  templateUrl: './directions-bar.component.html',
  styleUrls: ['./directions-bar.component.scss'],
})
export class DirectionsBarComponent implements OnInit {
  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    // this.origin = ADDRESSES.home.address;
    // this.destination = ADDRESSES.work.address;
    const originHTMLInput = document.getElementById(
      'origin'
    ) as HTMLInputElement;
    const destinationHTMLInput = document.getElementById(
      'destination'
    ) as HTMLInputElement;
    this.mapService.setOriginInput(originHTMLInput);
    this.mapService.setDestinationInput(destinationHTMLInput);
  }

  calculateAndDisplayRoute(travelMode: 'BICYCLING' | 'WALKING' | 'DRIVING') {
    return this.mapService.calculateAndDisplayRoute(
      google.maps.TravelMode[travelMode]
    );
  }
}
