import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { Artist } from '../../models/artist';

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
    return this.sanitizer.bypassSecurityTrustResourceUrl('http://www.youtube.com/embed?listType=search&list=' + this.artist.name);
  }

}
