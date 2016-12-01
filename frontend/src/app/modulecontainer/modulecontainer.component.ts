import { Component, OnInit } from '@angular/core';

import { SharedService } from '../shared/shared.service';
import { Subscription } from 'rxjs/Subscription';

import { Artist } from '../models/artist';
import { sinAndCos } from '../popularitygraph/popularitygraph.component';

@Component({
  selector: 'app-modulecontainer',
  templateUrl: './modulecontainer.component.html',
  styleUrls: ['./modulecontainer.component.css']
})
export class ModuleContainerComponent implements OnInit {

  artist: Artist = new Artist();
  popularityGraphData: any = [];
  subscription: Subscription;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    // subscribe to artist changes
    this.subscription = this.sharedService.artistItem
      .subscribe(item => {
        this.artist = item;
        this.popularityGraphData = sinAndCos(item.name);
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
