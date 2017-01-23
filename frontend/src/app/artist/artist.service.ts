import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Artist } from '../models/artist';
import { AppConfig } from "../shared/app.config";
import { BehaviorSubject } from "rxjs";

const cachedPages = 5;

@Injectable()
export class ArtistService {

  private endpoint: string = AppConfig.API_ENDPOINT;
  private artistsObs$ : BehaviorSubject<Artist[]> = new BehaviorSubject<Artist[]>([]);
  private headers: Headers = new Headers();
  private _page: number = 0;
  private _filter: string = '';
  private _cache: Artist[][] = new Array(cachedPages);
  private _cPointer: number = 0;
  private _exhausted: boolean = false;

  private _fillCache(a: Artist[]) {
    if (a.length > 0) {
      this._cache[this._cPointer] = a;
      this._cPointer = (this._cPointer + 1) % cachedPages;
    } else {
      this._exhausted = true;
    }
  }

  private _reduceCache() : Artist[] {
    let res: Artist[] = [];
    let i = 0;
    let j = 0;
    for (let k=0; k<cachedPages; k++) {
      i = (this._cPointer + k) % cachedPages;
      if (this._cache[i]) {
        console.log('adding all artists from cache #' + i);
        this._cache[i].forEach((a) => res[j++] = a);
      }
    }
    return res
  }

  private _updateAndGetCache(a: Artist[]) : Artist[] {
    this._fillCache(a);
    return this._reduceCache()
  }

  private _resetCache() {
    this._cache = new Array(cachedPages);
    this._cPointer = 0;
    this._page = 0;
    this._exhausted = false;
    this.nextPage();
  }

  set filter(value: string) {
    this._filter = value;
    this._resetCache();
  }

  constructor(private _http: Http) {
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Accept', 'application/json');
  }

  private _getArtists = (): Observable<Artist[]> => {
    let offset = (this._page * AppConfig.APP_CACHES_PAGESIZE);
    this._http
      .post(this.endpoint + 'query/artists/',{ 'offset' : offset, 'name' : this._filter}, { 'headers' : this.headers })
      .map((response: Response) => <Artist[]>response.json())
      .subscribe(
        data => {this.artistsObs$.next(this._updateAndGetCache(data))},
        error => {
          this.artistsObs$.error(error);
          // Recreate the Observable as after Error we cannot emit data anymore
          this.artistsObs$ = new BehaviorSubject<Artist[]>([]);
        }
      );
    return this.artistsObs$;
  };

  public nextPage() : Observable<Artist[]> {
    if (!this._exhausted) {
      let res = this._getArtists();
      this._page++;
      return res;
    }
  }

  public getArtist = (id: Number): Observable<Artist> => {
    return this._http.get(this.endpoint + 'query/artist/' + id)
      .map((response: Response) => <Artist>response.json());
  };

}
