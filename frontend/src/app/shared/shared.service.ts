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
    this.isWikipediaEnabled = (localStorage.getItem('isWikipediaEnabled') == 'true');

    if (localStorage.getItem('isDiscographyEnabled'))
      this.isDiscographyEnabled = (localStorage.getItem('isDiscographyEnabled') === 'true');
    if (localStorage.getItem('isPopularityEnabled'))
      this.isPopularityEnabled = (localStorage.getItem('isPopularityEnabled') === 'true');
    if (localStorage.getItem('isYoutubeEnabled'))
      this.isYoutubeEnabled = (localStorage.getItem('isYoutubeEnabled') === 'true');

    if (localStorage.getItem('isLabelLinksEnabled'))
      this.isLabelLinksEnabled = (localStorage.getItem('isLabelLinksEnabled') === 'true');
  }

  setWikipedia() {
    this.isWikipediaEnabled = !this.isWikipediaEnabled;
    localStorage.setItem('isWikipediaEnabled', this.isWikipediaEnabled.toString());
  }

  setDiscography() {
    this.isDiscographyEnabled = !this.isDiscographyEnabled;
    localStorage.setItem('isDiscographyEnabled', this.isDiscographyEnabled.toString());
  }

  setPopularity() {
    this.isPopularityEnabled = !this.isPopularityEnabled;
    localStorage.setItem('isPopularityEnabled', this.isPopularityEnabled.toString());
  }

  setYoutube() {
    this.isYoutubeEnabled = !this.isYoutubeEnabled;
    localStorage.setItem('isYoutubeEnabled', this.isYoutubeEnabled.toString());
  }

  setLabelLinks() {
    this.isLabelLinksEnabled = !this.isLabelLinksEnabled;
    localStorage.setItem('isLabelLinksEnabled', this.isLabelLinksEnabled.toString());
  }
}
