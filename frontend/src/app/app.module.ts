import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { SettingsComponent } from './settings/settings.component';
import { BrowserComponent } from './browser/browser.component';
import { ModuleContainerComponent } from './modulecontainer/modulecontainer.component';
import { SearchPipe } from './search.pipe';

import { SharedService } from './shared.service';

import { FrontendRoutingModule } from './app-routing.module';
import { WikipediaComponent } from './wikipedia/wikipedia.component';
import { PopularitygraphComponent } from './popularitygraph/popularitygraph.component';
import {nvD3} from "ng2-nvd3";

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SettingsComponent,
    BrowserComponent,
    ModuleContainerComponent,
    SearchPipe,
    WikipediaComponent,
    PopularitygraphComponent,
    nvD3
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FrontendRoutingModule,
    MaterialModule.forRoot()
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
