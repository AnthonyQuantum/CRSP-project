import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { DataService } from '../../services/data/data.service';
import { User } from '../../models/User'
import { CurrentUserModel } from '../../models/CurrentUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string;
  password: string;
  email: string;
  isValid = false;

  constructor(private _dataService: DataService,private router: Router, private currentUser: CurrentUserModel) {
   }

  // Register new user, check if successfully, login user
  registerUser() {
    let user = new User(this.name, this.password, this.email);
    this._dataService.addUser(user);
    this._dataService.loginUser(user)
      .subscribe(res => { 
        this.isValid = res; 
        if (res) {
          this.currentUser.setName(user.name);
          this.router.navigate(['/']);
        }
      });;
  }

}
