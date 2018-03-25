import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

import { DataService } from '../../services/data/data.service';
import { ConfirmModel } from '../../models/Confirm'
import { CurrentUserModel } from '../../models/CurrentUser';
import { TimeService } from '../../services/time/time.service';

@Component({  
    selector: 'confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  title: string;
  message: string;
  newTaskTitle: string;
  newTaskPriority = "A";
  newTaskTime = 1;
  newTaskStartTime = 1;
  times = [];

  constructor(dialogService: DialogService, private _dataService: DataService, private currentUser: CurrentUserModel, private _time: TimeService) {
    super(dialogService);
    this.times = this._time.generateTimes();
  }

  // Add new task and close modal window
  confirm() {
    this._dataService.addTask(this.newTaskTitle, this.newTaskPriority, this.newTaskTime, this.newTaskStartTime, this.currentUser.getName());
    this.result = true;
    this.close();
  }

  timeToTitle(time: number)
  {
    return this._time.timeToTitle(time);
  }
}