import { Component} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { CurrentUserModel } from '../../models/CurrentUser';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  OAuthURL: any;
  OAuthWindow: Window;
  Token: any;
  result: any;

  constructor(private currentUser: CurrentUserModel, private _dataService: DataService, private _http: Http) {
    this.getOAuthURL();
    window['ds'] = _dataService;
   }

  getCode()
  {
    this.OAuthWindow = window.open(this.OAuthURL, "Please sign in with Google", "width=300px,height=500px");

    window.onmessage = function(e) {
      var urlWithCode = e.data;
      var idx = urlWithCode.lastIndexOf("code=");
      var code = urlWithCode.substring(idx + 5).replace("#","");

      console.log(code);

      //var __dataService: DataService; // ERROR: Cannot read property 'getToken' of undefined
      window['ds'].getToken(code)
        .subscribe(res => console.log("Token: " + res));
    };
  }

  getOAuthURL() {
    this._dataService.getOAuthURL()
      .subscribe(res => this.OAuthURL = res);
  }

}
