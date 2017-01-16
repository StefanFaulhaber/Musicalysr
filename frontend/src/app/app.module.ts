import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';

import 'hammerjs';
import { nvD3 } from "ng2-nvd3";

import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { BrowserComponent } from './shared/browser/browser.component';
import { SearchPipe } from './pipes/search.pipe';
import { SharedService } from './shared/shared.service';
import { WikipediaComponent } from './artist/wikipedia/wikipedia.component';
import { ReleasesComponent } from './artist/releases/releases.component';
import { PopularitygraphComponent } from './artist/popularitygraph/popularitygraph.component';
import { YoutubeComponent } from './artist/youtube/youtube.component';
import { PlaceholderComponent } from "./shared/placeholder/placeholder.component";
import { ArtistComponent } from './artist/artist.component';
import { LabelComponent } from './label/label.component';
import { BrowserService } from "./shared/browser/browser.service";

// routes declarations

const routes: Routes = [
  { path: '', redirectTo: '/artist', pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent },
  {
    path: 'artist',
    children: [
      {
        path: ':id',
        component: ArtistComponent,
      },
      {
        path: '',
        component: PlaceholderComponent,
      }
    ]
  },
  { path: 'label',
    children: [
      {
        path: ':id',
        component: LabelComponent,
      },
      {
        path: '',
        component: PlaceholderComponent,
      }
    ]
  },
];

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    BrowserComponent,
    SearchPipe,
    WikipediaComponent,
    ReleasesComponent,
    PopularitygraphComponent,
    PlaceholderComponent,
    nvD3,
    YoutubeComponent,
    ArtistComponent,
    LabelComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    MaterialModule.forRoot()
  ],
  exports: [
    RouterModule
  ],
  providers: [
    SharedService,
    BrowserService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {

}
