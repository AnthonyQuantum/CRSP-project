import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css', '../tasks/tasks.component.css']
})
export class ScheduleComponent implements OnInit {

now: Date = new Date();

timeRows = [];
iter = 1;

  constructor() {
    while(this.iter < 12)
    {
      this.timeRows.push(this.iter + "am");
      this.iter++;
    }
    this.timeRows.push("12pm");
    this.iter = 1;
    while(this.iter < 12)
    {
      this.timeRows.push(this.iter + "pm");
      this.iter++;
    }
   }

  ngOnInit() {
  }

}
