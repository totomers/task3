import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, AfterViewInit {
  @ViewChild('search', { static: false }) searchElement: ElementRef;
  @ViewChild('infowindowContent') infowindowContent: ElementRef;
  @ViewChild('placeName') placeName: ElementRef;
  @ViewChild('placeAddress') placeAddress: ElementRef;
  constructor(private mapService: MapService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.mapService.setSearchInput(this.searchElement?.nativeElement);
  }
}
