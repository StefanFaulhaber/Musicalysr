import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { Label } from '../models/label';
import { AppConfig } from "../shared/app.config";

@Injectable()
export class LabelService {

  private endpoint: string;
  private headers: Headers;
  private

  constructor(private _http: Http) {
    this.endpoint = AppConfig.API_ENDPOINT;
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  // Labels
  public getAllLabels = (page = 0): Observable<Label[]> => {
    let offset = (page * AppConfig.APP_CACHES_PAGESIZE);
    return this._http.get(this.endpoint + 'query/labels/' + offset, {})
      .map((response: Response) => <Label[]>response.json());
  };

  public getLabels = (query: string): Observable<Label[]> => {
    return this._http.post(this.endpoint + 'query/labels/autocomplete/name', { 'name' : query } , { headers: this.headers })
      .map((response: Response) => <Label[]>response.json());
  };

  public getLabel = (id: Number): Observable<Label> => {
    return this._http.get(this.endpoint + 'query/label/' + id)
      .map((response: Response) => <Label>response.json());
  };

  public getLabelsOfArtist = (query: string): Observable<Label[]> => {
    return this._http.get(this.endpoint + '/query/artist/labels/' + query, { headers: this.headers })
      .map((response: Response) => <Label[]>response.json());
  };

}
