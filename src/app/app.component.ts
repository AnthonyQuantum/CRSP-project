import { Component } from '@angular/core';

import { CurrentUserModel } from './models/CurrentUser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private currentUser: CurrentUserModel) {
    
  }
  
}
