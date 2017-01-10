import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { BrowserComponent } from './browser/browser.component';
import { ModuleContainerComponent } from './modulecontainer/modulecontainer.component';
import { SearchPipe } from './pipes/search.pipe';

import { SharedService } from './shared/shared.service';

import { FrontendRoutingModule } from './app-routing.module';
import { WikipediaComponent } from './wikipedia/wikipedia.component';
import { ReleasesComponent } from './releases/releases.component';
import { PopularitygraphComponent } from './popularitygraph/popularitygraph.component';
import { nvD3 } from "ng2-nvd3";
import {MainRoutingComponent} from "./main/main-routing.module";
import {PlaceholderComponent} from "./placeholder/placeholder.component";
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    BrowserComponent,
    ModuleContainerComponent,
    SearchPipe,
    WikipediaComponent,
    ReleasesComponent,
    PopularitygraphComponent,
    PlaceholderComponent,
    nvD3,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FrontendRoutingModule,
    MainRoutingComponent,
    MaterialModule.forRoot()
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
