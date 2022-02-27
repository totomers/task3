import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
  @ViewChild('search', { static: false }) searchElement: ElementRef;
  map: google.maps.Map;
  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.map = this.mapService.getMap()!;
  }

  ngAfterViewInit(): void {
    const options = {
      fields: ['formatted_address', 'geometry', 'name'],
      strictBounds: false,
      types: ['establishment'],
    };

    const autocomplete = new google.maps.places.Autocomplete(
      this.searchElement?.nativeElement,
      options
    );

    google.maps.event.addListener(this.map, 'bounds_changed', function () {
      //@ts-ignore
      autocomplete.bindTo('bounds', mapObject);
    });
  }
}
