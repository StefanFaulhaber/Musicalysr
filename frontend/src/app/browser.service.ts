import { Injectable } from '@angular/core';

import { Artist } from './models/artist';
import { ARTISTS } from './mockartists';

@Injectable()
export class BrowserService {

  constructor() { }

  getArtists(): Artist[] {
    return ARTISTS;
  }
}
