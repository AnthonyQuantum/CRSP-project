import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data/data.service';
import { User } from '../../models/User'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string;
  password: string;
  email: string;
  isValid = false;

  constructor(private _dataService: DataService) {
   }

  ngOnInit() {
  }

  registerUser() {
    let user = new User(this.name, this.password, this.email);
    this._dataService.addUser(user);
    this._dataService.loginUser(user)
      .subscribe(res => this.isValid = res);
    if (this.isValid)
      console.log("Yes");
    else
      console.log("No");
  }

}
