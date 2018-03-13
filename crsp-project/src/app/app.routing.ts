import { Routes, RouterModule } from '@angular/router';

import { RhythmsComponent } from './components/rhythms/rhythms.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { TasksComponent } from './components/tasks/tasks.component';

const appRoutes: Routes = [
    { path: '', component: ScheduleComponent },
    { path: 'schedule', component: ScheduleComponent },
    { path: 'tasks', component: TasksComponent },
    { path: 'rhythms', component: RhythmsComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);