import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MapService } from 'src/app/services/map.service';
import { MarkersService } from 'src/app/services/markers.service';

@Component({
  selector: 'app-info-window',
  templateUrl: './info-window.component.html',
  styleUrls: ['./info-window.component.scss'],
})
export class InfoWindowComponent implements OnInit {
  currentPlace$: Observable<google.maps.places.PlaceResult | null>;
  constructor(
    private mapService: MapService,
    private markersService: MarkersService
  ) {}

  ngOnInit(): void {
    this.currentPlace$ = this.mapService.getCurrentPlace();
  }
  saveMarker() {
    this.markersService.saveMarker(this.mapService.getCurrentPlaceValue()!);
  }
  deleteMarker() {
    this.markersService.deleteMarker(
      this.mapService.getCurrentPlaceValue()?.id!
    );
  }
}
