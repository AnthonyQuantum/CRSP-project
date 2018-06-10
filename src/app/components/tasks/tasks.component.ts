import { Component } from '@angular/core';
import { DialogService } from "ng2-bootstrap-modal";

import { DataService } from '../../services/data/data.service';
import { NewTaskDialogComponent } from '../newTaskDialog/newTaskDialog.component';
import { CurrentUserModel } from '../../models/CurrentUser';
import { TimeService } from '../../services/time/time.service';
import { User } from '../../models/User';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent {

  tasks: Array<any>;
  status: number;
  times = [];

  wuTime: number;
  gtbTime: number;

  isValid = false;

  constructor(private _dataService: DataService, private dialogService:DialogService, private currentUser: CurrentUserModel, private _time: TimeService) {
    this._dataService.getTasks(this.currentUser.getName())
      .subscribe(res => this.tasks = res);
    this.times = this._time.generateTimes();
    this.wuTime = currentUser.getWuTime();
    this.gtbTime = currentUser.getGtbTime();
  }

  showDialog() {
      let disposable = this.dialogService.addDialog(NewTaskDialogComponent, {
          message:'Confirm message'})
          .subscribe((isConfirmed)=>{
              if(isConfirmed) {
                this._dataService.getTasks(this.currentUser.getName())
                  .subscribe(res => this.tasks = res);
              }
          });
  }

  deleteTask(event: any)
  {
    this._dataService.deleteTask(event.target.id, this.currentUser.getName());
    this._dataService.getTasks(this.currentUser.getName())
      .subscribe(res => this.tasks = res);
  }

  toggleStatus(event: any)
  {
    if (event.target.checked)
      this.status = 1;
    else
      this.status = 0;
    this._dataService.updateTask(event.target.id, this.status, this.currentUser.getName());
  }

  saveTimes()
  {
    this._dataService.saveTimes(this.wuTime, this.gtbTime, this.currentUser.getName());
  }

  timeToTitle(time: number)
  {
    return this._time.timeToTitle(time);
  }

}
