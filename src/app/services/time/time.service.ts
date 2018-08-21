import { Injectable } from '@angular/core';
import { SelectorListContext } from '@angular/compiler';

@Injectable()
export class TimeService {

  constructor() { }

   // Generate time strings (1am-11pm)
   generateTimes() {
    let times = [];

    for (let i = 1; i <= 96; ++i)
      times.push(i);

    return times;
  }

  durationToTitle(duration: number)
  {
    let h = 0;
    let m = 0;
    let result = "";

    h = Math.floor(duration / 4);
    m = (duration % 4) * 15;
    if (h != 0)
      result += h + "h ";
    if (m != 0)
      result += m + "m";

    return result;
  }

  timeToTitle(time: number)
  {
    let iP = 0;
    let fP = 0;
    let col = "";
    let ending = "";
    let result = "";

    iP = Math.floor((time-1) / 4);
    if (iP == 12 || iP == 24)
      iP = 12;
    else
      iP %= 12; 
    fP = ((time-1) % 4) * 15;
    if (time <= 48)
      ending = "am";
    else
      ending = "pm";
    if ((time-1) % 4 != 0) col = ":";

    result = iP.toString();
    if (fP != 0) result += col + fP;
    result += ending;

    return result;
  }

}
