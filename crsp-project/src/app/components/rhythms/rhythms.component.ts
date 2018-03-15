import { Component, AfterViewInit } from '@angular/core';
import { ChartsService } from '../../services/charts/charts.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'rhythms',
  templateUrl: './rhythms.component.html',
  styleUrls: ['./rhythms.component.css', '../tasks/tasks.component.css']
})
export class RhythmsComponent implements AfterViewInit {

  canvas: any;
  ctx: any;

  ngAfterViewInit() {
    this.canvas = document.getElementById('myChart');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
          labels: ["New", "In Progress", "On Hold"],
          datasets: [{
              label: '# of Votes',
              data: [1,2,3],
              backgroundColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
        responsive: false,
        display:true
      }
    });
  }

  constructor() {

   }

}
