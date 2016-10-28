import { Component, OnInit } from '@angular/core';

import { SharedService } from '../shared.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-modulecontainer',
  templateUrl: './modulecontainer.component.html',
  styleUrls: ['./modulecontainer.component.css']
})
export class ModuleContainerComponent implements OnInit {

  artist: string;
  subscription: Subscription;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.subscription = this.sharedService.item
       .subscribe(item => this.artist = item)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
