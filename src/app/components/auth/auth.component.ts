import { Component, OnInit } from '@angular/core';

import { CurrentUserModel } from '../../models/CurrentUser';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private currentUser: CurrentUserModel) {
    
   }

  ngOnInit() {
  }

}
