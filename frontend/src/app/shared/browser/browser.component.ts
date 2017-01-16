import { Component, OnInit} from '@angular/core';
import { SharedService } from '../shared.service';
import { Subscription } from 'rxjs/Subscription';
import { Artist } from '../../models/artist';
import { Label } from '../../models/label';
import 'rxjs/add/operator/switchMap';
import { ArtistService } from "../../artist/artist.service";
import { LabelService } from "../../label/label.service";

@Component({
  selector: 'app-browser',
  templateUrl: 'browser.component.html',
  styleUrls: ['browser.component.css'],
})
export class BrowserComponent implements OnInit {

  private artists: Artist[] = [];
  private artistSubscription: Subscription;

  private labels: Label[] = [];
  private labelSubscription: Subscription;

  private items: any[] = [];
  private selectedItem: any;

  private isChoiceArtists: boolean = true;
  private scrollPosition: number = 0;

  constructor(
    private artistService: ArtistService,
    private labelService: LabelService,
    private sharedService: SharedService) {}

  ngOnInit() {
    // get artists from backend
    this.artistSubscription = this.artistService
        .getAllArtists()
        .subscribe(
          (res: Artist[]) => {
            this.artists = res;
            this.displayItems();
          },
          error => console.log(error));

    // get labels from backend
    this.labelSubscription = this.labelService
        .getAllLabels()
        .subscribe(
          (res: Label[]) => {
            this.labels = res;
            this.displayItems();
          },
          error => console.log(error));
    //
    // // subscribe to artist changes
    // this.artistSubscription = this.sharedService.artistItem
    //   .subscribe(item => this.selectedItem = item);
    //
    // // subscribe to label changes
    // this.labelSubscription = this.sharedService.labelItem
    //   .subscribe(item => this.selectedItem = item);
  }

  ngOnDestroy() {
    this.artistSubscription.unsubscribe();
    this.labelSubscription.unsubscribe();
  }

  displayItems() {
    if (this.isChoiceArtists)
      this.items = this.artists;
    else
      this.items = this.labels;
  }

  getArtists(query: string) {
    this.artistService
        .getArtists(query)
        .subscribe(
          (res: Artist[]) => {
            this.artists = res;
            this.displayItems();
          },
          error => console.log(error));
  }

  getLabels(query: string) {
    this.labelService
        .getLabels(query)
        .subscribe(
          (res: Label[]) => {
            this.labels = res;
            this.displayItems();
          },
          error => console.log(error));
  }

  searchQuery(query) {
    if (this.isChoiceArtists)
      this.getArtists(query);
    else
      this.getLabels(query);
  }

  changeSearch(isChoiceArtists : boolean) {
    this.isChoiceArtists = isChoiceArtists;
    this.displayItems();
  }

  onScroll() {
    this.scrollPosition++;
    if (this.isChoiceArtists) {
      this.artistSubscription.unsubscribe();
      this.artistSubscription = this.artistService
        .getAllArtists(this.scrollPosition)
        .subscribe(
          (res: Artist[]) => {
            this.artists = this.artists.concat(res);
            this.displayItems();
          },
          error => console.log(error));
    } else {
      this.labelSubscription.unsubscribe();
      this.labelSubscription = this.labelService
        .getAllLabels(this.scrollPosition)
        .subscribe(
          (res: Label[]) => {
            this.labels = this.labels.concat(res);
            this.displayItems();
          },
          error => console.log(error));
    }
  }
}
