import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { User } from '../../models/User';
import { CurrentUserModel } from '../../models/CurrentUser';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../register/register.component.css']
})
export class LoginComponent implements OnInit {
  name: string;
  password: string;
  isValid = false;

  constructor(private _dataService: DataService, private router: Router, private currentUser: CurrentUserModel) { }

  ngOnInit() {
  }

  loginUser() {
    let user = new User(this.name, this.password, "");
    this._dataService.loginUser(user)
      .subscribe(res => { 
        this.isValid = res; 
        if (res) {
          console.log("Logged in");
          this.currentUser.setName(user.name);
          this.router.navigate(['/']);
        }
      });;
  }

}
