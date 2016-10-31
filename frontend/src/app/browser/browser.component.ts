import { Component, OnInit} from '@angular/core';

import { SharedService } from '../shared.service';
import { BrowserService } from '../browser.service';
import { Artist } from '../models/artist';
import { ModuleContainerComponent } from '../modulecontainer/modulecontainer.component';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css'],
  providers: [BrowserService]
})
export class BrowserComponent implements OnInit {

  artists: Artist[];
  selectedArtist: Artist;
  isActive: boolean = false;

  subscription: Subscription;

  constructor(
    private browserService: BrowserService,
    private sharedService: SharedService) {}

  ngOnInit() {
    // get artists from backend
    this.artists = this.browserService.getArtists();

    // subscribe to artist changes
    this.subscription = this.sharedService.artistItem
      .subscribe(item => this.selectedArtist = item)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectArtist(artist: Artist): void {
    this.sharedService.changeArtist(artist);
  }

}
