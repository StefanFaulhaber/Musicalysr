import { Component, OnInit } from '@angular/core';

import { SharedService } from '../shared.service';
import { WikipediaService } from './wikipedia.service';
import { Subscription } from 'rxjs/Subscription';

import { Artist } from '../models/artist';
import { WikipediaEntry } from './wikipediaentry';

@Component({
  selector: 'app-wikipedia',
  templateUrl: './wikipedia.component.html',
  styleUrls: ['./wikipedia.component.css'],
  providers: [WikipediaService]
})
export class WikipediaComponent implements OnInit {

  artist: Artist = new Artist();
  entry: WikipediaEntry = new WikipediaEntry();
  text: string = '';
  subscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private wikipediaService: WikipediaService) {}

  ngOnInit() {
    // subscribe to artist changes
    this.subscription = this.sharedService.artistItem
      .subscribe(item => {
        this.artist = item;
        if (item != null)
          this.getData();
      })
  }

  getData() {
    this.wikipediaService
        .getEntry(this.artist.name)
        .subscribe(
          (res: WikipediaEntry) => {
            try {
              this.entry = res;
              this.text = res.parse.text['*'];
              this.text = this.text.substring(this.text.indexOf('<p>'), this.text.indexOf('</p>'));
              this.text = this.text.replace(/<\/?[^>]+(>|$)/g, "");
            } catch (Error) {
              this.text = 'Keine Daten vorhanden.';
            }
          },
          error => console.log(error));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
