import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AppConfig } from '../app.config';

import { Artist } from '../../models/artist';
import { Label } from '../../models/label';

@Injectable()
export class BrowserService {

  private actionUrl: string;
  private headers: Headers;

  constructor(private _http: Http) {
    this.actionUrl = AppConfig.API_ENDPOINT;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  // Artists
  public getAllArtists = (): Observable<Artist[]> => {
    return this._http.get(this.actionUrl + 'query/artists/1', {})
        .map((response: Response) => <Artist[]>response.json());
  };

  public getArtists = (query: string): Observable<Artist[]> => {
    return this._http.post(this.actionUrl + 'query/artists/autocomplete/name', { 'name' : query } , { headers: this.headers })
        .map((response: Response) => <Artist[]>response.json());
  };

  public getArtist = (id: Number): Observable<Artist> => {
    return this._http.get(this.actionUrl + 'query/artist/' + id)
        .map((response: Response) => <Artist>response.json());
  };

  // Labels
  public getAllLabels = (): Observable<Label[]> => {
    return this._http.get(this.actionUrl + 'query/labels/1', {})
        .map((response: Response) => <Label[]>response.json());
  };

  public getLabels = (query: string): Observable<Label[]> => {
    return this._http.post(this.actionUrl + 'query/labels/autocomplete/name', { 'name' : query } , { headers: this.headers })
        .map((response: Response) => <Label[]>response.json());
  };

  public getLabel = (id: Number): Observable<Label> => {
    return this._http.get(this.actionUrl + 'query/label/' + id)
        .map((response: Response) => <Label>response.json());
  };

  public getLabelsOfArtist = (query: string): Observable<Label[]> => {
    return this._http.get(this.actionUrl + '/query/artist/labels/' + query, { headers: this.headers })
        .map((response: Response) => <Label[]>response.json());
  };

}
