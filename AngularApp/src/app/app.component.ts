import { Component } from '@angular/core';
import { Student } from './shared/student.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AngularApp';
  public currentStudent: Student= new Student;
}
