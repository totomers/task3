import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {} from 'googlemaps';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit,AfterViewInit {
  @ViewChild('map',{static:false}) mapElement: ElementRef;
  @ViewChild('autocomplete',{static:false}) autocomplete :ElementRef;
  @ViewChild('infowindowContent') infowindowContent :ElementRef;
  @ViewChild('placeName') placeName :ElementRef;
  @ViewChild('placeAddress') placeAddress :ElementRef;
  map: google.maps.Map;

  constructor() { }
  ngOnInit(): void {
    console.log("ngOnInit",this.mapElement)
  

 }


 ngAfterViewInit() {
  // child is set
  console.log("ngAfterViewInit",this.mapElement)
  console.log("ngAfterViewInit",this.autocomplete)
  const OFFICE_ADDRESS = new google.maps.LatLng(32.064620,34.771760);
  const mapDiv = this.mapElement?.nativeElement
  if(this.mapElement){
    const mapProperties = {
      center: OFFICE_ADDRESS,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
 };
 this.map = new google.maps.Map(mapDiv,mapProperties);
 const mapObject = this.map;

 const options = {
  fields: ["formatted_address", "geometry", "name"],
  strictBounds: false,
  types: ["establishment"],
};

 
const autocomplete = new google.maps.places.Autocomplete(this.autocomplete?.nativeElement, options);


// Bind the map's bounds (viewport) property to the autocomplete object,
// so that the autocomplete requests use the current map bounds for the
// bounds option in the request.
// autocomplete.bindTo("bounds", this.mapElement?.nativeElement);

google.maps.event.addListener(this.map,'bounds_changed', function() {
  //@ts-ignore
  autocomplete.bindTo("bounds",mapObject);
});


const infowindow = new google.maps.InfoWindow();


infowindow.setContent(this.infowindowContent.nativeElement);


const marker = new google.maps.Marker({ map:this.map,
  anchorPoint: new google.maps.Point(0, -29),
});


autocomplete.addListener("place_changed", () => {
  infowindow.close();
  marker.setVisible(false);

  try {
  const place = autocomplete.getPlace();
    
  } catch (error) {
    console.log(error);
  }

  const place = autocomplete.getPlace();

  if (!place.geometry || !place.geometry.location) {
    // User entered the name of a Place that was not suggested and
    // pressed the Enter key, or the Place Details request failed.
    window.alert("No details available for input: '" + place.name + "'");
    return;
  }

  // If the place has a geometry, then present it on a map.
  if (place.geometry.viewport) {
    this.map.fitBounds(place.geometry.viewport);
  } else {
    this.map.setCenter(place.geometry.location);
    this.map.setZoom(17);
  }

  marker.setPosition(place.geometry.location);
  marker.setVisible(true);
  this.placeName.nativeElement.textContent = place.name;
  this.placeAddress.nativeElement.textContent =
    place.formatted_address;
  infowindow.open(this.map, marker);
});

   }
}
}
