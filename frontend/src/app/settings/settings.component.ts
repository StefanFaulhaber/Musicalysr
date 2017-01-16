import { Component } from '@angular/core';

import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  constructor(private sharedService: SharedService) { }

  // Artist settings

  setWikipedia() {
    this.sharedService.isWikipediaEnabled = !this.sharedService.isWikipediaEnabled;
    this.sharedService.writeSettings();
  }

  setDiscography() {
    this.sharedService.isDiscographyEnabled = !this.sharedService.isDiscographyEnabled;
    this.sharedService.writeSettings();
  }

  setPopularity() {
    this.sharedService.isPopularityEnabled = !this.sharedService.isPopularityEnabled;
    this.sharedService.writeSettings();
  }

  setYoutube() {
    this.sharedService.isYoutubeEnabled = !this.sharedService.isYoutubeEnabled;
    this.sharedService.writeSettings();
  }

  // Label settings

  setLabelLinks() {
    this.sharedService.isLabelLinksEnabled = !this.sharedService.isLabelLinksEnabled;
    this.sharedService.writeSettings();
  }
}
