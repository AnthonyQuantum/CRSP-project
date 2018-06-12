import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { DataService } from '../../services/data/data.service';
import { TimeRow } from '../../models/TimeRow'
import { CurrentUserModel } from '../../models/CurrentUser';
import { TimeService } from '../../services/time/time.service';

@Component({
  selector: 'schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {

now: Date = new Date();
timeRows: Array<TimeRow>;
tasks: Array<any>;
gtb: number;
isGtb: boolean;

  constructor(private _dataService: DataService, private currentUser: CurrentUserModel, private _time: TimeService) {
   }

  // 19.5 -> "7:30pm"
  timeToTitle(time: number)
  {
    return this._time.timeToTitle(time);
  }

  generate() {
    this._dataService.generateSchedule(this.currentUser.getName());
  }

}
