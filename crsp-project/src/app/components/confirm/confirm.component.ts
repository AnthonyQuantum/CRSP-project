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

  constructor(dialogService: DialogService, private _dataService: DataService) {
    super(dialogService);
  }

  confirm() {
    this._dataService.addTask(this.newTaskTitle, this.newTaskPriority);
    this.result = true;
    this.close();
  }
}