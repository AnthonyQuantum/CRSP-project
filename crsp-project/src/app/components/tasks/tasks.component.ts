import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { ConfirmComponent } from '../confirm/confirm.component';
import { DialogService } from "ng2-bootstrap-modal";
import { CurrentUserModel } from '../../models/CurrentUser';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: Array<any>;
  searchPriority = "A/B";
  status: number;
  times = [];
  wakeUpTime: string;

  constructor(private _dataService: DataService, private dialogService:DialogService, private currentUser: CurrentUserModel) {
    this._dataService.getTasks(this.currentUser.getName())
      .subscribe(res => this.tasks = res);
    this.generateTimes();
    this.wakeUpTime = "6am";
  }

  showDialog() {
      let disposable = this.dialogService.addDialog(ConfirmComponent, {
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

  ngOnInit() {
  }

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
