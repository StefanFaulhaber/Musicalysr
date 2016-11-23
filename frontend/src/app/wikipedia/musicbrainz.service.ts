import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { MB_Artist } from '../models/mb_artist';

@Injectable()
export class MusicbrainzService {

  private actionUrl: string;
  private parameters: string;
  private headers: Headers;

  constructor(private _http: Http) {
    this.actionUrl = 'http://musicbrainz.org/ws/2/artist/';
    this.parameters = '?inc=url-rels&fmt=json';
 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/javascript');
    this.headers.append('Accept', 'application/javascript');
    this.headers.append('Origin', 'http://10.20.30.40:4200');
  }

  public getMbData = (query: string): Observable<MB_Artist> => {
    return this._http.get(this.actionUrl + query + this.parameters, {})
        .map((response: Response) => <MB_Artist>response.json());
  }
}
