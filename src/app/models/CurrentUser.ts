// Model for current user
import { Injectable } from '@angular/core';

@Injectable()
export class CurrentUserModel {
private name = null;
private wuTime = null;
private gtbTime = null;
public isValid = false;
public token = null;

constructor() {}

public setName(name: string)
{
    this.name = name;
}

public getName()
{
    return this.name;
}

public getWuTime()
{
    return this.wuTime;
}

public setWuTime(time: string)
{
    this.wuTime = time;
}

public getGtbTime()
{
    return this.gtbTime;
}

public setGtbTime(time: string)
{
    this.gtbTime = time;
}

public logout()
{
    this.name = null;
}

}