import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {

  private settingKeys: string[] = [
    'isWikipediaEnabled', 
    'isDiscographyEnabled', 
    'isPopularityEnabled', 
    'isYoutubeEnabled', 
    'isLabelLinksEnabled'];

  isChoiceArtists: boolean = true;

  constructor() {
    // init settings
    if (localStorage.length < 1) {
      for (let setting of this.settingKeys)
        localStorage.setItem(setting, 'true');
    }
  }

  setSetting(index: number) {
    let key = this.settingKeys[index];

    let temp: boolean = localStorage.getItem(key) == 'true';
    localStorage.setItem(key, (!temp).toString());
    console.log('Setting was ' + temp + ', is now ' + localStorage.getItem(key));
  }

  getSetting(index: number) {
    let key = this.settingKeys[index];
    return (localStorage.getItem(key) == 'true');
  }
}
