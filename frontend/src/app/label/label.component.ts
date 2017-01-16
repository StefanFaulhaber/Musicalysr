import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Label } from '../models/label';
import { ActivatedRoute, Params } from "@angular/router";
import { SharedService } from "../shared/shared.service";
import { LabelService } from "./label.service";

@Component({
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent implements OnInit {

  label: Label = new Label();
  subscription: Subscription;
  labelSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private labelService: LabelService,
    private sharedService: SharedService) {}

  ngOnInit() {
    // subscribe to label changes
    this.subscription = this.route.params
      .subscribe((params: Params) => {
        this.labelSubscription = this.labelService.getLabel(params['id'])
          .subscribe((label : Label) => {
            this.label = label;
          });
      })
  }

}
