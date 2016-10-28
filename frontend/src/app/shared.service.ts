import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Artist } from './models/artist';

@Injectable()
export class SharedService {

  artist: Artist = new Artist();
  source = new BehaviorSubject<Artist>(this.artist);  // Observable item source
  item = this.source.asObservable();                  // Observable item stream

  // service command
  changeArtist(a: Artist) {
    this.source.next(a);
  }
}
