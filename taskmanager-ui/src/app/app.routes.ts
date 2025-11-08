import { Routes } from '@angular/router';
import { TaskListComponent } from './tasks/tasklist/tasklist.component';

export const routes: Routes = [
    { path: '', component: TaskListComponent },
  { path: '**', redirectTo: '' }
];
