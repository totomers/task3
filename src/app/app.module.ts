import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { DirectionsBarComponent } from './components/directions-bar/directions-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    AutocompleteComponent,
    SearchBarComponent,
    DirectionsBarComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
