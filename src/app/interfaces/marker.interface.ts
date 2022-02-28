export type IMarker = google.maps.places.PlaceResult;
export interface IMarkerHashMap {
  [name: string]: IMarker;
}
