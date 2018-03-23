import { Component, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'rhythms',
  templateUrl: './rhythms.component.html',
  styleUrls: ['./rhythms.component.css']
})
export class RhythmsComponent implements AfterViewInit {

  canvas: any;
  ctx: any;

  // Generate chart
  ngAfterViewInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
          labels: ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm", "12am", "2am", "4am", "6am"],
          datasets: [{
              label: 'Natural rhythm',
              data: [100,120,132,115,100,100,107,111,103,90,70,53,100],
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

  constructor() {}

}
