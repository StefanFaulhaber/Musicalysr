import { Component, OnInit} from '@angular/core';

import { SharedService } from '../shared/shared.service';
import { BrowserService } from '../browser/browser.service';
import { ModuleContainerComponent } from '../modulecontainer/modulecontainer.component';

import { Subscription } from 'rxjs/Subscription';

import { Artist } from '../models/artist';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css'],
  providers: [BrowserService]
})
export class BrowserComponent implements OnInit {

  artists: Artist[] = new Array();
  selectedArtist: Artist;
  isActive: boolean = false;

  subscription: Subscription;

  constructor(
    private browserService: BrowserService,
    private sharedService: SharedService) {}

  ngOnInit() {
    // get artists from backend
    this.browserService
        .getAll()
        .subscribe(
          (res: Artist[]) => this.artists = res,
          error => console.log(error));

    // subscribe to artist changes
    this.subscription = this.sharedService.artistItem
      .subscribe(item => this.selectedArtist = item)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterArtists(query: string) {
    this.browserService
        .getAllFiltered(query)
        .subscribe(
          (res: Artist[]) => {
            this.artists = res;

            // reselect artist if filtered set contains it
            if (this.selectedArtist != null) {
              for (let artist of this.artists) {
                if (artist.id == this.selectedArtist.id)
                  this.selectArtist(artist); 
              }
            }
          },
          error => console.log(error));
  }

  selectArtist(artist: Artist): void {
    this.sharedService.changeArtist(artist);
  }

}
