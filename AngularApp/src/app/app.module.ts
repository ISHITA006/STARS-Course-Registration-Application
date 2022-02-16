import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PlanComponent } from './home-pages/plan/plan.component';
import { AddDropComponent } from './home-pages/add-drop/add-drop.component';
import { ChangeIndexComponent } from './home-pages/change-index/change-index.component';
import { CourseInfoComponent } from './home-pages/course-info/course-info.component';
import { TimetableComponent } from './home-pages/timetable/timetable.component';
import { HelpComponent } from './home-pages/help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    PlanComponent,
    AddDropComponent,
    ChangeIndexComponent,
    CourseInfoComponent,
    TimetableComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
