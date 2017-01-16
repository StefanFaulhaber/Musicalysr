import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map'
import { Observable } from 'rxjs/Observable';
import { WikipediaEntry } from '../../models/wikipediaentry';

@Injectable()
export class WikipediaService {

  private actionUrl: string;
  private headers: Headers;

  constructor(private _http: Http) {
    this.actionUrl = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&redirects=true&prop=text&page=';

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/javascript');
    this.headers.append('Accept', 'application/javascript');
    this.headers.append('Origin', 'http://10.20.30.40:4200');
  }

  public getEntry = (query: string): Observable<WikipediaEntry> => {
    return this._http.get(this.actionUrl + query, {})
        .map((response: Response) => <WikipediaEntry>response.json());
  }
}
