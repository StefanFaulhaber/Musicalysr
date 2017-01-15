import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Artist } from '../models/artist';
import { sinAndCos } from './popularitygraph/popularitygraph.component';
import { ActivatedRoute, Params } from "@angular/router";
import { BrowserService } from "../shared/browser/browser.service";
import { SharedService } from "../shared/shared.service";

@Component({
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
  providers: [BrowserService]
})
export class ArtistComponent implements OnInit {

  artist: Artist = new Artist();
  popularityGraphData: any = [];
  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private browserService: BrowserService,
              private sharedService: SharedService) {}

  ngOnInit() {
    // subscribe to artist changes
    this.subscription = this.route.params
      .subscribe((params: Params) => {
        // this.artist = item;
        this.artist.id = params['id'];
        this.popularityGraphData = sinAndCos(params['id']);
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
