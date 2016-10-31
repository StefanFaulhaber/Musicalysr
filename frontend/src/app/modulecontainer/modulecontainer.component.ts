import { Component, OnInit } from '@angular/core';

import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs/Subscription';

import { Artist } from '../models/artist';

@Component({
  selector: 'app-modulecontainer',
  templateUrl: './modulecontainer.component.html',
  styleUrls: ['./modulecontainer.component.css']
})
export class ModuleContainerComponent implements OnInit {

  artist: Artist = new Artist();
  subscription: Subscription;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    // subscribe to artist changes
    this.subscription = this.sharedService.artistItem
      .subscribe(item => this.artist = item)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
