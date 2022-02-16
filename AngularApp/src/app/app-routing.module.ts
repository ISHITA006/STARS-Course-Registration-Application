import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddDropComponent } from './home-pages/add-drop/add-drop.component';
import { ChangeIndexComponent } from './home-pages/change-index/change-index.component';
import { CourseInfoComponent } from './home-pages/course-info/course-info.component';
import { HelpComponent } from './home-pages/help/help.component';
import { PlanComponent } from './home-pages/plan/plan.component';
import { TimetableComponent } from './home-pages/timetable/timetable.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', component: LoginComponent, pathMatch: 'full'},
  {path: 'home/:id', component: HomeComponent,pathMatch: 'full'},
  {path: 'home/plan/:id', component: PlanComponent, pathMatch: 'full'},
  {path: 'home/addDrop/:id', component: AddDropComponent, pathMatch: 'full'},
  {path: 'home/change/:id', component: ChangeIndexComponent, pathMatch: 'full'},
  {path: 'home/courseInfo/:id', component: CourseInfoComponent, pathMatch: 'full'},
  {path: 'home/timetable/:id', component: TimetableComponent, pathMatch: 'full'},
  {path: 'home/help/:id', component: HelpComponent, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }