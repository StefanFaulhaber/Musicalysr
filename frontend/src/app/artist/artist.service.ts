import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import * as moment from 'moment';

import { Artist } from '../models/artist';
import { AppConfig } from "../shared/app.config";

@Injectable()
export class ArtistService {

  private endpoint: string;
  private headers: Headers;

  constructor(private _http: Http) {
    this.endpoint = AppConfig.API_ENDPOINT;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getAllArtists = (page = 0): Observable<Artist[]> => {
    let offset = (page * AppConfig.APP_CACHES_PAGESIZE);
    return this._http.get(this.endpoint + 'query/artists/' + offset, {})
      .map((response: Response) => <Artist[]>response.json());
  };

  public getArtists = (query: string): Observable<Artist[]> => {
    return this._http.post(this.endpoint + 'query/artists/autocomplete/name', { 'name' : query } , { headers: this.headers })
      .map((response: Response) => <Artist[]>response.json());
  };

  public getArtist = (id: Number): Observable<Artist> => {
    return this._http.get(this.endpoint + 'query/artist/' + id)
      .map((response: Response) => <Artist>response.json());
  };

}
