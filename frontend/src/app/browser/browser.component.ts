import { Component, OnInit } from '@angular/core';

import { SharedService } from '../shared.service';
import { BrowserService } from '../browser.service';
import { Artist } from '../models/artist';
import { ModuleContainerComponent } from '../modulecontainer/modulecontainer.component';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  providers: [BrowserService],
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent implements OnInit {

  artists: Artist[];

  constructor(
    private browserService: BrowserService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.artists = this.browserService.getArtists();
  }

  selectArtist(name: string): void {
    this.sharedService.changeArtist(name);
  }

}
