import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import 'nvd3';
import * as moment from 'moment';


@Component({
  selector: 'app-popularitygraph',
  templateUrl: './popularitygraph.component.html',
  styleUrls: [
    './popularitygraph.component.css'
  ]
})
export class PopularitygraphComponent implements OnInit {

  options;
  data;

  constructor() { }

  ngOnInit() {
    this.options = {
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
            return d3.time.format('%b %d')(new Date(d));
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

    this.data = sinAndCos();

    function sinAndCos() {
      var sin = [],sin2 = [],
        cos = [];

      //Data is represented as an array of {x,y} pairs.

      for (var i = 0; i < 122; i++) {
        sin.push({x: moment().add(i, 'days'), y: Math.sin(i/10)});
        sin2.push({x: moment().add(i, 'days'), y: Math.sin(i/10) *0.25 + 0.5});
        cos.push({x: moment().add(i, 'days'), y: .5 * Math.cos(i/10+ 2) + Math.random() / 10});
      }
      console.log(sin2);

      //Line chart data should be sent as an array of series objects.
      return [
        // {
        //   values: sin,      //values - represents the array of {x,y} data points
        //   key: 'Sine Wave', //key  - the name of the series.
        //   color: '#ff7f0e'  //color - optional: choose your own line color.
        // },
        // {
        //   values: cos,
        //   key: 'Cosine Wave',
        //   color: '#2ca02c'
        // },
        {
          values: sin2,
          key: '@Madonna',
          color: '#7777ff',
          area: true      //area - set to true if you want this line to turn into a filled area chart.
        }
      ];
    }

  }
}
