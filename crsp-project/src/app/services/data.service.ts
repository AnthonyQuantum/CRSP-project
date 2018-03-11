import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  result: any;

  constructor(private _http: Http) { }

  getTasks() {
    return this._http.get("/api/tasks")
      .map(result => this.result = result.json().data);
  }

  addTask(title: string, priority: string) {
    this._http.post("/api/tasksAdd", {
      title: title,
      priority: priority,
      status: 0
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
}
