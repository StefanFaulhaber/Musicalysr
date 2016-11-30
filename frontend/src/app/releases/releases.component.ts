import { Component, OnInit } from '@angular/core';

import { SharedService } from '../shared/shared.service';
import { MusicbrainzService } from '../shared/musicbrainz.service';
import { Subscription } from 'rxjs/Subscription';

import { Artist } from '../models/artist';
import { MB_Artist } from '../models/mb_artist';
import { MB_Release } from '../models/mb_release';

@Component({
  selector: 'app-releases',
  templateUrl: './releases.component.html',
  styleUrls: ['./releases.component.css'],
  providers: [MusicbrainzService]
})
export class ReleasesComponent implements OnInit {

  artist: Artist = new Artist();
  releases: MB_Release[] = new Array();
  subscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private musicbrainzService: MusicbrainzService) { }

  ngOnInit() {
    // subscribe to artist changes
    this.subscription = this.sharedService.artistItem
      .subscribe(item => {
        this.artist = item;
        if (this.artist != null)
          this.getReleases();
        else
          this.releases = new Array();
      })
  }

  getReleases() {
    if (this.artist.id != null) {
      this.musicbrainzService
        .getMbReleases(this.artist.id)
        .subscribe(
          (res: MB_Artist) => {
            this.releases = res['releases'];     
          },
          error => console.log(error));
    }
  }

}
