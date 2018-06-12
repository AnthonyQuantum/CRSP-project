import { Component} from '@angular/core';

import { CurrentUserModel } from '../../models/CurrentUser';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  constructor(private currentUser: CurrentUserModel, private _dataService: DataService) {
    this.getToken();
   }

  getToken()
  {
    this._dataService.getToken(this.currentUser.getName());
  }

  allowCalendarAccess() {
    console.log('OK in component');
    this._dataService.allowCalendarAccess(this.currentUser.getName());;
  }

}
