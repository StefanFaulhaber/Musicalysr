import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { BrowserService } from './browser.service';
import { Subscription } from 'rxjs/Subscription';
import { Artist } from '../models/artist';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css'],
  providers: [BrowserService]
})
export class BrowserComponent implements OnInit {

  artists: Artist[] = [];
  selectedId: Number;

  subscription: Subscription;

  constructor(
    private browserService: BrowserService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    // get artists from backend
    this.browserService
        .getAll()
        .subscribe(
          (res: Artist[]) => this.artists = res,
          error => console.log(error));

    console.log(this.route);
    // subscribe to artist changes
    this.subscription = this.route.params
      .subscribe((params: Params) => {
      this.selectedId = +params['id'];
      console.log(+params['id']);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  filterArtists(query: string) {
    this.browserService
        .getAllFiltered(query)
        .subscribe((artists: Artist[]) => {
            this.artists = artists;
          },
          error => console.log(error));
  }

}
