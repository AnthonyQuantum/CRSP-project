import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { DataService } from '../../services/data/data.service';
import { User } from '../../models/User';
import { CurrentUserModel } from '../../models/CurrentUser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name: string;
  password: string;
  isValid = false;

  constructor(private _dataService: DataService, private router: Router, private currentUser: CurrentUserModel) { }

  // Check if user exists and login
  loginUser() {
    let user = new User(this.name, this.password, "");
    this._dataService.loginUser(user)
      .subscribe(res => { 
        this.isValid = this.currentUser.isValid; 
        if (this.isValid) {
          this.currentUser.setName(user.name);
          this.router.navigate(['/']);
        }
      });
  }

}
