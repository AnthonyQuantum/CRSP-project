import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

import { DataService } from '../../services/data/data.service';
import { NewTaskDialogModel } from '../../models/NewTaskDialog'
import { CurrentUserModel } from '../../models/CurrentUser';
import { TimeService } from '../../services/time/time.service';

@Component({  
    selector: 'confirm',
    templateUrl: './newTaskDialog.component.html',
    styleUrls: ['./newTaskDialog.component.css']
})
export class NewTaskDialogComponent extends DialogComponent<NewTaskDialogModel, boolean> implements NewTaskDialogModel {
  title: string;
  message: string;
  newTaskTitle: string;
  newTaskPriority = "A";
  newTaskTime = 1;
  newTaskStartTime = 1;
  newTaskDivisible = true;
  times = [];
  durations = [];

  constructor(dialogService: DialogService, private _dataService: DataService, private currentUser: CurrentUserModel, private _time: TimeService) {
    super(dialogService);
    this.times = this._time.generateTimes();
    this.durations = [1, 2, 3, 4, 6, 8, 12];
  }

  // Add new task and close modal window
  confirm() {
    if (this.newTaskPriority == "T")
      this._dataService.addTask(this.newTaskTitle, this.newTaskPriority, this.newTaskTime, this.newTaskStartTime, this.newTaskDivisible, this.currentUser.name);
    else
      this._dataService.addTask(this.newTaskTitle, this.newTaskPriority, this.newTaskTime, -1, this.newTaskDivisible, this.currentUser.name);
    this.result = true;
    this.close();
  }

  timeToTitle(time: number)
  {
    return this._time.timeToTitle(time);
  }

  durationToTitle(duration: number)
  {
    return this._time.durationToTitle(duration);
  }

  boolToWord(v: boolean)
  {
    if (v)
      return "Yes";
    else
      return "No";
  }
}