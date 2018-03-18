import { Component } from '@angular/core';
import { DialogComponent, DialogService } from "ng2-bootstrap-modal";
import { DataService } from '../../services/data/data.service';
export interface ConfirmModel {
  title:string;
  message:string;
}

@Component({  
    selector: 'confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css', '../tasks/tasks.component.css']
})
export class ConfirmComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel {
  title: string;
  message: string;
  newTaskTitle: string;
  newTaskPriority = "A";
  newTaskTime = 1;
  newTaskStartTime = "1am";

  times = [];

  constructor(dialogService: DialogService, private _dataService: DataService) {
    super(dialogService);
    this.generateTimes();
  }

  confirm() {
    this._dataService.addTask(this.newTaskTitle, this.newTaskPriority, this.newTaskTime, this.newTaskStartTime);
    this.result = true;
    this.close();
  }

  generateTimes() {
    let iter = 1;
    while(iter < 12)
    {
      this.times.push(iter + "am");
      iter++;
    }
    this.times.push("12pm");
    iter = 1;
    while(iter < 12)
    {
      this.times.push(iter + "pm");
      iter++;
    }
  }
}