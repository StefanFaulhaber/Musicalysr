import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';

import { Artist } from '../models/artist';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.css']
})
export class YoutubeComponent implements OnInit {

  artist: Artist = new Artist();
  subscription: Subscription;
  width: number;
  height: number;

  constructor(
    private sharedService: SharedService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    // subscribe to artist changes
    this.subscription = this.sharedService.artistItem
      .subscribe(item => {
        this.artist = item;
      })
  }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed?listType=search&list=' + this.artist.name);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
