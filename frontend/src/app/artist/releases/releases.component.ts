import { Component, OnChanges, Input } from '@angular/core';

import * as moment from 'moment';

import { MusicbrainzService } from '../../shared/musicbrainz.service';
import { Artist } from '../../models/artist';
import { MB_Artist } from '../../models/mb_artist';
import { MB_Release } from '../../models/mb_release';

@Component({
  selector: 'app-releases',
  templateUrl: 'releases.component.html',
  styleUrls: ['releases.component.css'],
  providers: [MusicbrainzService]
})
export class ReleasesComponent implements OnChanges {

  @Input() artist: Artist = new Artist();
  releases: MB_Release[] = new Array();

  constructor(
    private musicbrainzService: MusicbrainzService) { }

  ngOnChanges () {
    // subscribe to artist changes
    if (this.artist != null)
      this.getReleases();
    else
      this.releases = [];
  }

  private getReleases() {
    if (this.artist.id != null) {
      this.musicbrainzService
        .getMbReleases(this.artist.id)
        .subscribe(
          (res: MB_Artist) => {
            this.filterReleases(res['releases']);
          },
          error => console.log(error));
    }
  }

  private filterReleases(res: MB_Release[]) {
    let seen: string[] = [];
    let result: MB_Release[] = [];

    for (let release of res) {
      if (seen.indexOf(release.title) < 0) {
        seen.push(release.title)
        // format date
        if (release.date.length > 4)
          release.date = moment(release.date).format('DD.MM.YYYY');
        result.push(release)
      }
    }

    this.releases = result;
  }

}
