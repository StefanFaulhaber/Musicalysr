import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Artist } from '../models/artist';
import { sinAndCos } from '../popularitygraph/popularitygraph.component';
import {ActivatedRoute, Params} from "@angular/router";
import {BrowserService} from "../browser/browser.service";

@Component({
  selector: 'app-modulecontainer',
  templateUrl: './modulecontainer.component.html',
  styleUrls: ['./modulecontainer.component.css'],
  providers: [BrowserService]
})
export class ModuleContainerComponent implements OnInit {

  artist: Artist = new Artist();
  popularityGraphData: any = [];
  subscription: Subscription;

  constructor(private route: ActivatedRoute,
  private artists: BrowserService) {}

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
