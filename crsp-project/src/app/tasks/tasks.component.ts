import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  tasks: Array<any>;

  constructor(private _dataService: DataService) {
    this._dataService.getTasks()
      .subscribe(res => this.tasks = res);
  }

  newTask()
  {

  }

  ngOnInit() {
  }

}
