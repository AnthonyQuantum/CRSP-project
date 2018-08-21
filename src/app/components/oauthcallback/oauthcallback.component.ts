import { Component} from '@angular/core';

@Component({
  selector: 'app-oauthcallback',
  templateUrl: './oauthcallback.component.html',
  styleUrls: ['./oauthcallback.component.css']
})
export class OauthcallbackComponent {

  constructor() 
  {
    window.opener.postMessage(location.href, "*");
    window.close();
  }
}
