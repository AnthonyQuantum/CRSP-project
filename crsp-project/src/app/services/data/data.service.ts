import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { UUID } from 'angular2-uuid';

@Injectable()
export class DataService {

  result: any;

  constructor(private _http: Http) { }

  getTasks() {
    return this._http.get("/api/tasks")
      .map(result => this.result = result.json().data);
  }

  addTask(title: string, priority: string, time: number) {
    this._http.post("/api/tasksAdd", {
      title: title,
      priority: priority,
      status: 0,
      id: UUID.UUID(),
      time: time
    })
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
      }
    )
  }

  deleteTask(id: string) {
    this._http.delete("/api/tasksDelete/" + id)
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
      }
    )
  }

  updateTask(id: string, status: number) {
    this._http.put("/api/tasksUpdate/" + id, { status: status })
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
      }
    )
  }


}
