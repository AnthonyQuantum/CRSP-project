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
  code: any;

  constructor(private _http: Http, private currentUser: CurrentUserModel) { }

  // Get tasks
  getTasks(username: string) {
    return this._http.get("/api/tasks/" + username)
      .map(result => this.currentUser.tasks = result.json().data);
  }

  // Add task
  addTask(title: string, priority: string, time: number, startTime: number, divisible: boolean, username: string) {
    this._http.post("/api/tasksAdd/" + username, {
      title: title,
      priority: priority,
      status: 0,
      id: UUID.UUID(),
      time: time,
      startTime: startTime,
      divisible: divisible
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

  // Delete task
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

  //Update task status (checked/unchecked)
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

  // Add new user
  addUser(user: User) {
    this._http.post("/api/addUser", {
      name: user.name,
      password: user.password,
      email: user.email,
      wakeUpTime: user.wakeUpTime,
      goToBedTime: user.goToBedTime,
      tasks: user.tasks,
      token: null
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

  // Login user (check if exists)
  loginUser(user: User) {
    return this._http.post("/api/loginUser", {
      name: user.name,
      password: user.password
    })
    .map(result =>  {
      this.currentUser.wuTime = result.json().wuTime;
      this.currentUser.gtbTime = result.json().gtbTime;
      this.currentUser.isValid = result.json().isValid;
      this.currentUser.token = result.json().token;
      this.currentUser.tasks = result.json().tasks;
      this.currentUser.tasksArray = result.json().tasks;
      localStorage.setItem('SecretToken', result.json().secretToken);
      })
  }

  saveTimes(wuTime: number, gtbTime: number, username: string)
  {
    this._http.put("/api/wsTime/" + username + "/" + wuTime + "/" + gtbTime, { })
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
      }
    )
  }

  generateSchedule(name: string, replaceCurrent: boolean, fromNow: boolean)
  {
    this._http.post("/api/generateSchedule/" + name + "?replace=" + replaceCurrent + "&fromNow=" + fromNow, {})
    .subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log("Error occured");
      }
    )
  }

  getToken(code: string, user: string)
  {
    return this._http.get("/api/getToken?code=" + code + "&user=" + user)
      .map(result => this.result = result.json().data);
  }

  getOAuthURL()
  {
    return this._http.get("/api/getOAuthURL")
      .map(result => this.result = result.json().data);
  }

  loginToken(token: string) {
    return this._http.get("/api/loginToken?token=" + token)
    .map(result =>  {
      this.currentUser.name = result.json().name;
      this.currentUser.wuTime = result.json().wuTime;
      this.currentUser.gtbTime = result.json().gtbTime;
      this.currentUser.isValid = result.json().isValid;
      this.currentUser.token = result.json().token;
      this.currentUser.tasks = result.json().tasks;
      this.currentUser.tasksArray = result.json().tasks;
      localStorage.setItem('SecretToken', result.json().secretToken);
      })
  }

  loginUserByToken() {
    let secret = localStorage.getItem('SecretToken');
    if (secret != undefined)
    {
      this.loginToken(secret)
        .subscribe(res => {});
    }
  }
}