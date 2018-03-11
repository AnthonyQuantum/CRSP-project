import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';


import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { DataService } from './services/data.service';
import { TasksComponent } from './components/tasks/tasks.component';
import { FilterPipe }from './pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
