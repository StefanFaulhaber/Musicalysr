import { Component, OnInit } from '@angular/core';

import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  ngOnInit() {}

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

}
