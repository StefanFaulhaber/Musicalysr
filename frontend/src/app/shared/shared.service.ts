import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {

  isWikipediaEnabled: boolean;
  isDiscographyEnabled: boolean;
  isPopularityEnabled: boolean;
  isYoutubeEnabled: boolean;
  isLabelLinksEnabled: boolean;

  isChoiceArtists: boolean = true;

  constructor() {
    if (localStorage.getItem('isWikipediaEnabled'))
      this.isWikipediaEnabled = (localStorage.getItem('isWikipediaEnabled') === 'true');
    if (localStorage.getItem('isDiscographyEnabled'))
      this.isDiscographyEnabled = (localStorage.getItem('isDiscographyEnabled') === 'true');
    if (localStorage.getItem('isPopularityEnabled'))
      this.isPopularityEnabled = (localStorage.getItem('isPopularityEnabled') === 'true');
    if (localStorage.getItem('isYoutubeEnabled'))
      this.isYoutubeEnabled = (localStorage.getItem('isYoutubeEnabled') === 'true');

    if (localStorage.getItem('isLabelLinksEnabled'))
      this.isLabelLinksEnabled = (localStorage.getItem('isLabelLinksEnabled') === 'true');
  }

  writeSettings() {
    localStorage.setItem('isWikipediaEnabled', this.isWikipediaEnabled.toString());
    localStorage.setItem('isDiscographyEnabled', this.isDiscographyEnabled.toString());
    localStorage.setItem('isPopularityEnabled', this.isPopularityEnabled.toString());
    localStorage.setItem('isYoutubeEnabled', this.isYoutubeEnabled.toString());

    localStorage.setItem('isLabelLinksEnabled', this.isLabelLinksEnabled.toString());
  }
}
