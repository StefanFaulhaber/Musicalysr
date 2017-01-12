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

  constructor() {
    if (localStorage.getItem('isWikipediaEnabled'))
      this.isWikipediaEnabled = (localStorage.getItem('isWikipediaEnabled') === 'true');
    if (localStorage.getItem('isDiscographyEnabled'))
      this.isDiscographyEnabled = (localStorage.getItem('isDiscographyEnabled') === 'true');
    if (localStorage.getItem('isPopularityEnabled'))
      this.isPopularityEnabled = (localStorage.getItem('isPopularityEnabled') === 'true');
    if (localStorage.getItem('isYoutubeEnabled'))
      this.isYoutubeEnabled = (localStorage.getItem('isYoutubeEnabled') === 'true');
  }

  // service command
  changeArtist(a: Artist) {
    this.artistSource.next(a);
  }

  writeSettings() {
    localStorage.setItem('isWikipediaEnabled', this.isWikipediaEnabled.toString());
    localStorage.setItem('isDiscographyEnabled', this.isDiscographyEnabled.toString());
    localStorage.setItem('isPopularityEnabled', this.isPopularityEnabled.toString());
    localStorage.setItem('isYoutubeEnabled', this.isYoutubeEnabled.toString());
  }
}
