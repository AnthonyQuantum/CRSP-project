import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';

import { TimeService } from '../../services/time/time.service';
import { CurrentUserModel } from '../../models/CurrentUser';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'rhythms',
  templateUrl: './rhythms.component.html',
  styleUrls: ['./rhythms.component.css']
})
export class RhythmsComponent implements AfterViewInit {

  canvas: any;
  ctx: any;
  timesShow = ["12am", "2am", "4am", "6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm", "12am"];
  valuesShow = [90,70,53,100,120,132,115,100,100,107,111,103,90];

  times = [];
  timeTitles = [];
  values = [90,85,80,75,70,65,60,56,53,70,80,90,100,105,
    110,115,120,123,129,131,132,131,125,120,115,111,
    106,102,101,100,100,100,101,103,105,106,107,108,
    110,111,111,110,108,105,103,100,96,93,90];

  // Generate chart
  ngAfterViewInit() {
    this.times = this._time.generateTimes();
    for (let time of this.times)
    {
      this.timeTitles.push(this.timeToTitle(time));
    }
    this.timeTitles.push("12am");
    console.log(this.timeTitles);

    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
          labels: this.timesShow,
          datasets: [{
              label: 'Natural rhythm',
              data: this.valuesShow,
              backgroundColor: [
                  '#1E90FF',
                  '#1E90FF',
                  '#1E90FF'
              ],
              borderWidth: 2,
              borderColor: '#1E90FF', // light blue
              fill: false 
          }]
      },
      options: {
        responsive: false,
        display:true
      }
    });
  }

  constructor(private _time: TimeService, private currentUser: CurrentUserModel, private _dataService: DataService) {
    this._dataService.loginUserByToken();
  }

  timeToTitle(time: number)
  {
    return this._time.timeToTitle(time);
  }
}
