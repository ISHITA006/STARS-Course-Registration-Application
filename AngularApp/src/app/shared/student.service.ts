import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
//import { BehaviorSubject } from 'rxjs';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/toPromise';

import { Student } from './student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  selectedStudent: Student = {
  _id: "",
  MATRIC: "",
  NAME: "",
  USER_ID : "",
  PASSWORD : "",
  TOTAL_AU : 0,
  REGISTERED_COURSES : {},
  SAVED_PLANS: []
  };
  students: Student[] = [];
  readonly baseURL = 'http://localhost:3000/students';

  constructor(private http : HttpClient) { }


  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.baseURL);   
  }

  getSelectedStudent(id: String):  Observable<Student>{
    return this.http.get<Student>(this.baseURL+`/${id}`);
  }

  updateStudent(){
    return this.http.put(this.baseURL + `/${this.selectedStudent._id}`, this.selectedStudent);
  }

}
