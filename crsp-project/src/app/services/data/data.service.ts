import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { UUID } from 'angular2-uuid';

import { User } from '../../models/User'
import { CurrentUserModel } from '../../models/CurrentUser';

@Injectable()
export class DataService {

  result: any;
  isValid = false;

  constructor(private _http: Http) { }

  getTasks(username: string) {
    console.log(username);
    return this._http.get("/api/tasks/" + username)
      .map(result => this.result = result.json().data);
  }

  addTask(title: string, priority: string, time: number, startTime: string, username: string) {
    this._http.post("/api/tasksAdd/" + username, {
      title: title,
      priority: priority,
      status: 0,
      id: UUID.UUID(),
      time: time,
      startTime: startTime
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

  deleteTask(id: string, username: string) {
    this._http.delete("/api/tasksDelete/" + username  + "/" + id)
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
      }
    )
  }

  updateTask(id: string, status: number, username: string) {
    this._http.put("/api/tasksUpdate/" + username + "/" + id, { status: status })
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
      }
    )
  }

  addUser(user: User) {
    this._http.post("/api/addUser", {
      name: user.name,
      password: user.password,
      email: user.email,
      wakeUpTime: user.wakeUpTime,
      goToBedTime: user.goToBedTime,
      tasks: user.tasks
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

  loginUser(user: User) {
    return this._http.post("/api/loginUser", {
      name: user.name,
      password: user.password
    })
    .map(result => this.isValid = result.json().isValid)
  }


}
