import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Artist } from '../models/artist';
import { sinAndCos } from './popularitygraph/popularitygraph.component';
import { ActivatedRoute, Params } from "@angular/router";
import { SharedService } from "../shared/shared.service";
import { ArtistService } from "./artist.service";

@Component({
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  artist: Artist = new Artist();
  popularityGraphData: any = [];
  subscription: Subscription;
  artistSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private sharedService: SharedService) {}

  ngOnInit() {
    // subscribe to artist changes
    this.subscription = this.route.params
      .subscribe((params: Params) => {
        this.artistSubscription = this.artistService.getArtist(params['id'])
          .subscribe((artist : Artist) => {
            this.artist = artist;
            this.popularityGraphData = sinAndCos(artist.name);
          });
      })
  }

  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    if (this.artistSubscription)
      this.artistSubscription.unsubscribe();
  }

}
