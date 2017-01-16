import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { MB_Artist } from '../models/mb_artist';
import { MB_Label } from '../models/mb_label';
import { MB_Release } from '../models/mb_release';

@Injectable()
export class MusicbrainzService {

  private actionUrl: string;
  private labelUrl: string;
  private UrlParameters: string;
  private ReleaseParameters: string;
  private headers: Headers;

  constructor(private _http: Http) {
    this.actionUrl = 'http://musicbrainz.org/ws/2/artist/';
    this.labelUrl = 'http://musicbrainz.org/ws/2/label/';
    this.UrlParameters = '?inc=url-rels&fmt=json';
    this.ReleaseParameters = '?inc=releases&fmt=json';
 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/javascript');
    this.headers.append('Accept', 'application/javascript');
    this.headers.append('Origin', 'http://10.20.30.40:4200');
  }

  public getMbData = (query: string): Observable<MB_Artist> => {
    return this._http.get(this.actionUrl + query + this.UrlParameters, {})
        .map((response: Response) => <MB_Artist>response.json());
  }

  public getMbLabelData = (query: string): Observable<MB_Label> => {
    return this._http.get(this.labelUrl + query + this.UrlParameters, {})
        .map((response: Response) => <MB_Label>response.json());
  }

  public getMbReleases = (query: string): Observable<MB_Artist> => {
    return this._http.get(this.actionUrl + query + this.ReleaseParameters, {})
        .map((response: Response) => <MB_Artist>response.json());
  }
}
