import { Component, OnInit } from '@angular/core';

import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  ngOnInit() {}

}
