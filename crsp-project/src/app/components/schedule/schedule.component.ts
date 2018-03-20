import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DataService } from '../../services/data/data.service';

class TimeRow {
  title: string;
  task: any;

  constructor(title: string, task: any) {
    this.title = title;
    this.task = task;
  }
}

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css', '../tasks/tasks.component.css']
})
export class ScheduleComponent implements OnInit {

now: Date = new Date();

timeRows: Array<TimeRow>;
tasks: Array<any>;

  constructor(private _dataService: DataService) {
    this._dataService.getTasks()
      .subscribe(res => { 
        this.tasks = res; 
        this.generateTimeRows(); 
      });
      
   }

  ngOnInit() {
  }

  generateTimeRows() {
    let iter = 1;
    let timeRow: TimeRow; 
    let title: string;
    this.timeRows = [];
    let Task: any;

    while(iter < 24)
    {
      if (iter < 12)
        title = iter + "am";
      else if (iter == 12)
      {
        title = "12pm";
      }
      else
        title = (iter-12) + "pm";

      Task = this.tasks.find(t => t.priority == 'T' && t.startTime == title);
      timeRow = new TimeRow(title, Task);
      this.timeRows.push(timeRow);
      iter++;
    }
  }

}
