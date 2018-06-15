import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';

import { DataService } from './services/data/data.service';
import { TimeService } from './services/time/time.service';
import { TasksComponent } from './components/tasks/tasks.component';
import { FilterPipe }from './pipes/filter.pipe';
import { NewTaskDialogComponent } from './components/newTaskDialog/newTaskDialog.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { RhythmsComponent } from './components/rhythms/rhythms.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { CurrentUserModel } from './models/CurrentUser';
import { AuthComponent } from './components/auth/auth.component';
import { OauthcallbackComponent } from './components/oauthcallback/oauthcallback.component';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    FilterPipe,
    NewTaskDialogComponent,
    ScheduleComponent,
    RhythmsComponent,
    RegisterComponent,
    LoginComponent,
    AuthComponent,
    OauthcallbackComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BootstrapModalModule.forRoot({container:document.body}),
    routing
  ],
  entryComponents: [
    NewTaskDialogComponent
  ],
  providers: [DataService, TimeService, CurrentUserModel],
  bootstrap: [AppComponent]
})
export class AppModule { }
