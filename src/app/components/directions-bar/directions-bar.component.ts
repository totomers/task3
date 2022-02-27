import { Component, OnInit } from '@angular/core';
import { ADDRESSES } from 'src/app/data-variables';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-directions-bar',
  templateUrl: './directions-bar.component.html',
  styleUrls: ['./directions-bar.component.scss'],
})
export class DirectionsBarComponent implements OnInit {
  origin: string;
  destination: string;

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.origin = ADDRESSES.home.address;
    this.destination = ADDRESSES.work.address;
  }

  calculateAndDisplayRoute(travelMode: 'BICYCLING' | 'WALKING' | 'DRIVING') {
    return this.mapService.calculateAndDisplayRoute(
      this.origin,
      this.destination,
      google.maps.TravelMode[travelMode]
    );
  }
}
