import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SharedService {

  artist: string = 'Kein Künstler ausgewählt.';
  source = new BehaviorSubject<string>(this.artist);  // Observable item source
  item = this.source.asObservable();                  // Observable item stream

  // service command
  changeArtist(string) {
    this.source.next(string);
  }
}
