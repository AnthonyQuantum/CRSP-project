import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { DataService } from '../../services/data/data.service';
import { TimeRow } from '../../models/TimeRow'
import { CurrentUserModel } from '../../models/CurrentUser';
import { TimeService } from '../../services/time/time.service';
import { User } from '../../models/User';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {

now: Date = new Date();
timeRows: Array<TimeRow>;
tasks: Array<any>;
gtb: number;
isGtb: boolean;

  constructor(private _dataService: DataService, private currentUser: CurrentUserModel, private _time: TimeService) {
    this.gtb = parseFloat(this.currentUser.getGtbTime());
    if (this.gtb != Math.floor(this.gtb))
      this.isGtb = true;
    else
      this.isGtb = false;
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
    let Task1: any;
    let Task2: any;
    let wu: number;
    let gtb: number;
    let sleep = null;

    wu = this.currentUser.getWuTime();
    gtb = parseFloat(this.currentUser.getGtbTime());

    // Creating empty TimeRows
    while(iter < 25)
    {
      if (iter < 12)
        title = iter + "am";
      else if (iter == 12)
        title = "12pm";
      else
        title = (iter-12) + "pm";

      if (iter == 24) title = "";
      timeRow = new TimeRow(title);
      this.timeRows.push(timeRow);
      iter += 1;
    }

    // Add Sleep fields
    for (let timeRow of this.timeRows)
    {
      if (timeRow.title == "1am")
        timeRow.sleep = wu;
      if (timeRow.title == this.timeToTitle(gtb+0.5) || timeRow.title == this.timeToTitle(gtb+1))
        timeRow.sleep = 24-gtb;
    }

    // Add tasks
    for (let timeRow of this.timeRows)
    {
      console.log("isBefore");
      // Add time-bound tasks
      Task1 = this.tasks.find(t => t.priority == 'T' && this.timeToTitle(t.startTime+1) == timeRow.title);
      timeRow.task1 = Task1;
      Task2 = this.tasks.find(t => t.priority == 'T' && this.timeToTitle(t.startTime+0.5) == timeRow.title);
      timeRow.task2 = Task2;
      console.log("isBefore");

      // If Task1 slot is free then
      if (timeRow.task1 == null || timeRow.task1 == undefined)
      {
        console.log("isBefore");
        Task1 = this.tasks.find(t => this.timeToTitle(t.startTime+1) == timeRow.title || t.startTime.length != undefined);
        console.log("isBefore");
        if (Task1 != undefined && Task1.startTime.length != undefined)
        {
          console.log("isBefore");
          for (let time of Task1.startTime)
          {
            if (this.timeToTitle(time+1) == timeRow.title)
              timeRow.task1 = Task1;
          }
        }
        else
          timeRow.task1 = Task1;
      }

      // If Task2 slot is free then
      if (timeRow.task2 == null || timeRow.task2 == undefined)
      {
        Task2 = this.tasks.find(t => this.timeToTitle(t.startTime+0.5) == timeRow.title || t.startTime.length != undefined);
        if (Task2 != undefined && Task2.startTime.length != undefined)
        {
          for (let time of Task2.startTime)
          {
             if (this.timeToTitle(time+0.5) == timeRow.title)
              timeRow.task2 = Task2;
          }
        }
        else
          timeRow.task2 = Task2;
      }
    }
    console.log(this.timeRows);
  }

  // Log out the user
  logout()
  {
    this.currentUser.setName(null);
  }

  // Calculate task height (25px per slot)
  calculateHeight(task: any)
  {
    if (task.startTime.length != undefined)
      return 25;
    else
      return task.time * 50;
  }

  // 19.5 -> "7:30pm"
  timeToTitle(time: number)
  {
    return this._time.timeToTitle(time);
  }

}
