import { Injectable } from '@angular/core';

@Injectable()
export class CurrentUserModel {
private name: string;

constructor() {}

public setName(name: string)
{
    this.name = name;
}

public getName()
{
    return this.name;
}

}