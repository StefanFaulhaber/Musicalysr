import {Component, OnInit, OnChanges} from '@angular/core';
import * as d3 from 'd3';
import 'nvd3';
import * as moment from 'moment';
import {ViewChild} from "@angular/core/src/metadata/di";
import {nvD3} from "ng2-nvd3";
import {Input} from "@angular/core/src/metadata/directives";

let options = {
  chart: {
    type: 'lineChart',
    height: 350,
    margin : {
      top: 20,
      right: 20,
      bottom: 40,
      left: 55
    },
    x: function(d){ return d.x; },
    y: function(d){ return d.y; },
    useInteractiveGuideline: true,
    dispatch: {
      stateChange: function(e){ console.log("stateChange"); },
      changeState: function(e){ console.log("changeState"); },
      tooltipShow: function(e){ console.log("tooltipShow"); },
      tooltipHide: function(e){ console.log("tooltipHide"); }
    },
    xAxis: {
      axisLabel: 'Time',
      tickFormat: function(d){
        return d3.time.format('%b %d \'%y')(new Date(d));
      }
    },
    yAxis: {
      axisLabel: 'Popularity',
      tickFormat: function(d){
        return d3.format('.02f')(d);
      },
      axisLabelDistance: -10
    },
    callback: function(chart){
      console.log("!!! lineChart callback !!!");
    }
  }
};

@Component({
  selector: 'app-popularitygraph',
  templateUrl: 'popularitygraph.component.html',
  styleUrls: [
    'popularitygraph.component.css'
  ]
})
export class PopularitygraphComponent implements OnInit, OnChanges {

  options;

  @ViewChild('graph') nvD3: nvD3;
  @Input() data: any;

  constructor() { }

  ngOnInit() {
    this.options = options;
    // this.data = sinAndCos();
  }

  ngOnChanges () {
    if (this.options) {
      this.nvD3.updateWithData(this.data);
      console.log(this.nvD3);
    }
  }

}

export function sinAndCos(name : string) {
  var sin = [];
  for (var i = 0; i < 122; i++) {
    sin.push({x: moment().add(i, 'days'), y: Math.sin(i/10) *0.25 + 0.5 + Math.random() / 15});
  }
  return [
    {
      values: sin,
      key: name,
      color: '#607d8b',
      area: true      //area - set to true if you want this line to turn into a filled area chart.
    }
  ];
}
