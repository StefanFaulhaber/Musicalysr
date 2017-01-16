import { Component, Input, OnChanges } from '@angular/core';

import { MusicbrainzService } from '../../shared/musicbrainz.service';
import { Label } from '../../models/label';
import { MB_Label } from '../../models/mb_label';

@Component({
  selector: 'label-links',
  templateUrl: './labellinks.component.html',
  styleUrls: ['./labellinks.component.css'],
  providers: [MusicbrainzService]
})
export class LabelLinksComponent {

  @Input() label: Label = new Label();
  links = new Array();
  linkSuffix: string = 'http://de.wikipedia.org';

  constructor(
    private musicbrainzService: MusicbrainzService) {}

  ngOnChanges() {
    if (this.label != null && Object.keys(this.label).length > 0)
      this.getLinks();
  }

  private getLinks() {
    this.musicbrainzService.getMbLabelData(this.label.id).subscribe(
      (data: MB_Label) => (this.links = data.relations),
      (error) => (console.log(error))
    );
  }
}
