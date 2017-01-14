import { Component, OnInit} from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { BrowserService } from './browser.service';
import { Subscription } from 'rxjs/Subscription';
import { Artist } from '../models/artist';
import { Label } from '../models/label';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css'],
  providers: [BrowserService]
})
export class BrowserComponent implements OnInit {

  artists: Artist[] = new Array();
  artistSubscription: Subscription;

  labels: Label[] = new Array();
  labelSubscription: Subscription;

  items: any[] = new Array();
  selectedItem: any;

  constructor(
    private browserService: BrowserService,
    private sharedService: SharedService) {}

  ngOnInit() {
    // get artists from backend
    this.browserService
        .getAllArtists()
        .subscribe(
          (res: Artist[]) => {
            this.artists = res;
            this.displayItems();
          },
          error => console.log(error));

    // get labels from backend
    this.browserService
        .getAllLabels()
        .subscribe(
          (res: Label[]) => {
            this.labels = res;
            this.displayItems();
          },
          error => console.log(error));

    // Mock Backend
    // this.artists = this.browserService.getArtists();

    this.sharedService.isChoiceArtists = true;

    // subscribe to artist changes
    this.artistSubscription = this.sharedService.artistItem
      .subscribe(item => this.selectedItem = item)

    // subscribe to label changes
    this.labelSubscription = this.sharedService.labelItem
      .subscribe(item => this.selectedItem = item)
  }

  ngOnDestroy() {
    this.artistSubscription.unsubscribe();
    this.labelSubscription.unsubscribe();
  }

  displayItems() {
    if (this.sharedService.isChoiceArtists)
      this.items = this.artists;
    else
      this.items = this.labels;
  }

  getArtists(query: string) {
    this.browserService
        .getArtists(query)
        .subscribe(
          (res: Artist[]) => {
            this.artists = res;
            this.displayItems();
          },
          error => console.log(error));
  }

  getLabels(query: string) {
    this.browserService
        .getLabels(query)
        .subscribe(
          (res: Label[]) => {
            this.labels = res;
            this.displayItems();
          },
          error => console.log(error));
  }

  selectItem(item: any): void {
    if (this.sharedService.isChoiceArtists)
      this.sharedService.changeArtist(item);
    else
      this.sharedService.changeLabel(item);
  }

  searchQuery(query) {
    if (this.sharedService.isChoiceArtists)
      this.getArtists(query);
    else
      this.getLabels(query);
  }

  changeSearch(b: boolean) {
    if (b) {
      this.sharedService.isChoiceArtists = true;
      this.items = this.artists;
    } else {
      this.sharedService.isChoiceArtists = false;
      this.items = this.labels;
    }
  }
}
