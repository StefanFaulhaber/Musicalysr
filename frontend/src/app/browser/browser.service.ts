import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';

import { Artist } from '../models/artist';

@Injectable()
export class BrowserService {

  private actionUrl: string;
  private headers: Headers;

  constructor(private _http: Http) {
    this.actionUrl = 'http://10.20.30.40:2050/';
 
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  public getAll = (): Observable<Artist[]> => {
    return this._http.get(this.actionUrl + 'query/artists/', {})
        .map((response: Response) => <Artist[]>response.json());
  }

  public getAllFiltered = (query: string): Observable<Artist[]> => {
    return this._http.get(this.actionUrl + 'query/artists/autocomplete/' + query, { headers: this.headers })
        .map((response: Response) => <Artist[]>response.json());
  }
}
