import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { StudentService } from '../shared/student.service';
import { Student } from '../shared/student.model';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [StudentService]
})
export class LoginComponent implements OnInit {

  constructor(private studentService: StudentService, private router: Router) { }

  ngOnInit(): void {
    this.studentService.getAllStudents()
    .subscribe(data => this.studentService.students = data );
    
  }

email: String = "";
password: String = "";
error: String = "";
invalid: boolean= false;

login(){
  if(this.checkValidUser()===true){
    this.router.navigate(['home', this.studentService.selectedStudent._id]);   
  }

}



checkValidUser(): boolean {

  for (let student of this.studentService.students) {

    if(student.USER_ID === this.email){ 
      if(student.PASSWORD===this.password){
      //console.log("user valid"); 
      this.studentService.selectedStudent= student;
      this.invalid= false;
      this.error = "";
      return true;
    }
    else {
    //console.log("user invalid");
    this.invalid= true;
    this.error="Username and password do not match!";
    return false;
    }
      break;
    }
    else continue;
  }
  this.invalid= true;
  this.error = "User invalid!";

  return false;
}

}
