import { Injectable } from '@angular/core';

@Injectable()
export class CurrentUserModel {
private name = "abc";

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