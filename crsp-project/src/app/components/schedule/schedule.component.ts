import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { DataService } from '../../services/data/data.service';
import { TimeRow } from '../../models/TimeRow'
import { CurrentUserModel } from '../../models/CurrentUser';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {

now: Date = new Date();
timeRows: Array<TimeRow>;
tasks: Array<any>;

  constructor(private _dataService: DataService, private currentUser: CurrentUserModel) {
    // Get all tasks
    this._dataService.getTasks(this.currentUser.getName())
      .subscribe(res => { 
        this.tasks = res; 
        this.generateTimeRows(); 
      });
   }

  // Generate time rows (1am-11pm)
  generateTimeRows() {
    let iter = 1;
    let timeRow: TimeRow; 
    let title: string;
    this.timeRows = [];
    let Task: any;
    let wu = this.toNormalTime(this.currentUser.getWuTime());
    let gtb = this.toNormalTime(this.currentUser.getGtbTime());
    let sleep = null;

    while(iter < 24)
    {
      sleep = null;
      if (iter < 12)
        title = iter + "am";
      else if (iter == 12)
      {
        title = "12pm";
      }
      else
        title = (iter-12) + "pm";

      if (iter == 1)
      {
        sleep = wu;
      }
      else if (iter == gtb)
      {
        sleep = 24 - gtb;
      }
      else
      {
        Task = this.tasks.find(t => t.priority == 'T' && t.startTime == title);
      }

      timeRow = new TimeRow(title, Task, sleep);
      this.timeRows.push(timeRow);
      iter++;
    }
    console.log(this.timeRows);
  }

  // Log out the user
  logout()
  {
    this.currentUser.setName(null);
  }

  toNormalTime(timeStr: string)
  {
    let lastIndex = timeStr.length;
    let type = timeStr.substring(lastIndex-2);
    let num = parseInt(timeStr.substring(0, lastIndex-2));
    if (type == "pm")
      num += 12;
    return num;
  }

}
