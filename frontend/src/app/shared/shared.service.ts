import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Artist } from '../models/artist';

@Injectable()
export class SharedService {

  isWikipediaEnabled: boolean = true;
  isDiscographyEnabled: boolean = true;
  isPopularityEnabled: boolean = true;
  isYoutubeEnabled: boolean = true;

  artist: Artist = new Artist();
  artistSource = new BehaviorSubject<Artist>(this.artist);  // Observable item source
  artistItem = this.artistSource.asObservable();            // Observable item stream

  // service command
  changeArtist(a: Artist) {
    this.artistSource.next(a);
  }
}
