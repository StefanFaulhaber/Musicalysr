import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { Artist } from '../../models/artist';
import { AppConfig } from "../../shared/app.config";

@Component({
  selector: 'app-youtube',
  templateUrl: 'youtube.component.html',
  styleUrls: ['youtube.component.css']
})
export class YoutubeComponent {

  @Input() artist: Artist = new Artist();
  width: number;
  height: number;

  constructor(
    private sanitizer: DomSanitizer) { }

  getUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(AppConfig.YT_ARTIST_SEARCHURL + this.artist.name);
  }

}
