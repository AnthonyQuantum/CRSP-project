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

  status: number;
  times = [];

  isValid = false;

  constructor(private _dataService: DataService, private dialogService:DialogService, private currentUser: CurrentUserModel, private _time: TimeService) {
    this._dataService.loginUserByToken();
    this.times = this._time.generateTimes();
  }

  showDialog() {
      let disposable = this.dialogService.addDialog(NewTaskDialogComponent, {
          message:'Confirm message'})
          .subscribe((isConfirmed)=>{
              if(isConfirmed) {
                this._dataService.getTasks(this.currentUser.name)
                  .subscribe(res => { 
                    this.currentUser.tasks = res;
                    this.currentUser.tasksArray = res;
                   });
              }
          });
  }

  deleteTask(event: any)
  {
    this._dataService.deleteTask(event.target.id, this.currentUser.name);
    this._dataService.getTasks(this.currentUser.name)
      .subscribe(res => { 
        this.currentUser.tasks = res;
        this.currentUser.tasksArray = res;
      });
  }

  toggleStatus(event: any)
  {
    if (event.target.checked)
      this.status = 1;
    else
      this.status = 0;
    this._dataService.updateTask(event.target.id, this.status, this.currentUser.name);
  }

  saveTimes()
  {
    this._dataService.saveTimes(this.currentUser.wuTime, this.currentUser.gtbTime, this.currentUser.name);
  }

  timeToTitle(time: number)
  {
    return this._time.timeToTitle(time);
  }

  durationToTitle(duration: number)
  {
    return this._time.durationToTitle(duration);
  }

  // Log out the user
   logout()
   {
     this.currentUser.logout();
   }

}
