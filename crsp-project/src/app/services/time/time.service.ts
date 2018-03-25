import { Injectable } from '@angular/core';

@Injectable()
export class TimeService {

  constructor() { }

   // Generate time strings (1am-11pm)
   generateTimes() {
     let times = [];
    let iter = 0;
    while(iter < 24)
    {
      times.push(iter);
      iter += 0.5;
    }
    return times;
  }

  timeToTitle(time: number)
  {
    let ending = "";
    let iP = 0;
    let fP = "";
    let result = "";

    if (Math.floor(time) == 0)
      iP = 12;
    else
    {
      iP = Math.floor(time);
    }
    if (time < 12)
      ending = "am";
    else
    {
      ending = "pm";
      if (iP != 12)
        iP -= 12;
    }
    if (time != Math.floor(time) && time != 0)
      fP = ":30";
    result = iP + fP + ending;
    return result;
  }

}
