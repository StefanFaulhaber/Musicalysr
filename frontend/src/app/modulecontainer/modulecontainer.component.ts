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

  popularityGraphData: any = [];

  artistSubscription: Subscription;
  labelSubscription: Subscription;
  selectedItem: any;

  noArtistSelected: boolean = true;
  noLabelSelected: boolean = true;

  constructor(private sharedService: SharedService) {}

  ngOnInit() {
    // subscribe to artist changes
    this.artistSubscription = this.sharedService.artistItem
      .subscribe(item => {
        this.selectedItem = item;
        this.popularityGraphData = sinAndCos(item.name);

        if (Object.keys(this.selectedItem).length > 0)
          this.noArtistSelected = false;
      })

    // subscribe to label changes
    this.labelSubscription = this.sharedService.labelItem
      .subscribe(item => {
        this.selectedItem = item;

        if (Object.keys(this.selectedItem).length > 0)
          this.noLabelSelected = false;
      })
  }

  ngOnDestroy() {
    this.artistSubscription.unsubscribe();
    this.labelSubscription.unsubscribe();
  }

}
