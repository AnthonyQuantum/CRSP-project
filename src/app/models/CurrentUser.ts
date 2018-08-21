// Model for current user
import { Injectable } from '@angular/core';

@Injectable()
export class CurrentUserModel {
public name = null;
public wuTime = null;
public gtbTime = null;
public isValid = false;
public token = null;
public gotToken = false;
public tasks = {};
public tasksArray = [];

constructor() {}

public logout()
{
    this.name = null;
    this.wuTime = null;
    this.gtbTime = null;
    this.isValid = false;
    this.token = null;
    this.gotToken = false;
    this.tasks = {};
    this.tasksArray = [];
    localStorage.removeItem('SecretToken');
}

}