import { Component, OnInit } from '@angular/core';

import { SharedService } from '../shared/shared.service';
import { WikipediaService } from './wikipedia.service';
import { MusicbrainzService } from './musicbrainz.service';
import { Subscription } from 'rxjs/Subscription';

import { Artist } from '../models/artist';
import { WikipediaEntry } from '../models/wikipediaentry';
import { MB_Artist } from '../models/mb_artist';

@Component({
  selector: 'app-wikipedia',
  templateUrl: './wikipedia.component.html',
  styleUrls: ['./wikipedia.component.css'],
  providers: [WikipediaService, MusicbrainzService]
})
export class WikipediaComponent implements OnInit {

  artist: Artist = new Artist();
  text: string = '';
  subscription: Subscription;

  constructor(
    private sharedService: SharedService,
    private wikipediaService: WikipediaService,
    private musicbrainzService: MusicbrainzService) {}

  ngOnInit() {
    // subscribe to artist changes
    this.subscription = this.sharedService.artistItem
      .subscribe(item => {
        this.artist = item;
        if (this.artist != null)
          this.getLink();
      })
  }

  getLink() {
    if (this.artist.id != null) {
      let wikilink: string;

      this.musicbrainzService
        .getMbData(this.artist.id)
        .subscribe(
          (res: MB_Artist) => {
            for (let rel of res.relations) {
              if (rel.type == "wikipedia") {
                wikilink = rel.url.resource;
                break;
              }
            }

            if (wikilink != null) {
              let suffix = wikilink.substring(wikilink.lastIndexOf('/')+1);
              this.getData(suffix);
            } else {
              this.text = 'Keine Daten vorhanden.';
            }
            
          },
          error => console.log(error));
    }
  }

  getData(link: string) {
    this.wikipediaService
        .getEntry(link)
        .subscribe(
          (res: WikipediaEntry) => {
            try {
              this.text = res.parse.text['*'];

              if (this.text.indexOf('toc') != -1)
                this.text = this.text.substring(this.text.indexOf('<p>'), this.text.indexOf('toc'));
              else
                this.text = this.text.substring(this.text.indexOf('<p>'), this.text.indexOf('<h2'));

              this.text = this.text.replace(/<\/?[^>]+(>|$)/g, "");
              this.text = this.text.replace(/\[(.*?)\]/g, "");
              this.text = this.text.replace(/\&(.*?)\;/g, " ");
            } catch (e) {
              this.text = 'Keine Daten vorhanden.';
              console.log(e);
            }
          },
          error => console.log(error));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
