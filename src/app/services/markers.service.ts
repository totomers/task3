import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMarker, IMarkerHashMap } from '../interfaces/marker.interface';

@Injectable({
  providedIn: 'root',
})
export class MarkersService {
  private _markers = new BehaviorSubject<IMarkerHashMap>({});
  private readonly _markers$ = this._markers.asObservable();
  constructor() {}

  getMarkersObservable() {
    return this._markers$;
  }

  getMarkersValue() {
    return this._markers.getValue();
  }

  setMarkers(markers: IMarkerHashMap) {
    this._markers.next(markers);
  }

  saveMarker(marker: IMarker) {
    const markersObject = this.getMarkersValue();
    markersObject[`${marker.id}`] = marker;
    this.setMarkers(markersObject);
  }

  deleteMarker(id: string) {
    const markersObject = this.getMarkersValue();
    delete markersObject[id];
    this.setMarkers(markersObject);
  }
  getMarkersArray() {
    return Object.values(this.getMarkersValue());
  }
  resetMarkers() {
    this.setMarkers({});
  }
}
