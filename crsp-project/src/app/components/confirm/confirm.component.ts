import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";

import { DataService } from '../../services/data/data.service';
import { ConfirmModel } from '../../models/Confirm'
import { CurrentUserModel } from '../../models/CurrentUser';

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
  newTaskStartTime = "1am";
  times = [];

  constructor(dialogService: DialogService, private _dataService: DataService, private currentUser: CurrentUserModel) {
    super(dialogService);
    this.generateTimes();
  }

  // Add new task and close modal window
  confirm() {
    this._dataService.addTask(this.newTaskTitle, this.newTaskPriority, this.newTaskTime, this.newTaskStartTime, this.currentUser.getName());
    this.result = true;
    this.close();
  }

  // Generate time strings (1am-11pm)
  generateTimes() {
    let iter = 1;
    let title: string;
    while(iter < 24)
    {
      if (iter < 12)
        title = iter + "am";
      else if (iter == 12)
        title = "12pm";
      else
        title = (iter-12) + "pm";
      this.times.push(title);
      iter++;
    }
  }
}