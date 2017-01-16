import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { WikipediaEntry } from '../../models/wikipediaentry';
import { AppConfig } from "../../shared/app.config";

@Injectable()
export class WikipediaService {

  private actionUrl: string;
  private headers: Headers;

  constructor(private _http: Http) {
    this.actionUrl = AppConfig.WIKI_ENDPOINT;

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/javascript');
    this.headers.append('Accept', 'application/javascript');
    this.headers.append('Origin', AppConfig.APP_BASEURL);
  }

  public getEntry = (query: string): Observable<WikipediaEntry> => {
    return this._http.get(this.actionUrl + query, {})
        .map((response: Response) => <WikipediaEntry>response.json());
  }
}
