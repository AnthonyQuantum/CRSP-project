import { Routes, RouterModule } from '@angular/router';

import { RhythmsComponent } from './components/rhythms/rhythms.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { AuthComponent } from './components/auth/auth.component';
import { OauthcallbackComponent } from './components/oauthcallback/oauthcallback.component';

const appRoutes: Routes = [
    { path: '', component: ScheduleComponent },
    { path: 'schedule', component: ScheduleComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'rhythms', component: RhythmsComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'oauthcallback',  component: OauthcallbackComponent },
    // otherwise redirect to home
    { path: '**',  redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);