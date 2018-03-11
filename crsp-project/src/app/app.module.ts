import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';


import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { DataService } from './services/data.service';
import { TasksComponent } from './components/tasks/tasks.component';
import { FilterPipe }from './pipes/filter.pipe';
import { ConfirmComponent } from './components/confirm/confirm.component';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    FilterPipe,
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BootstrapModalModule.forRoot({container:document.body})
  ],
  entryComponents: [
    ConfirmComponent
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
