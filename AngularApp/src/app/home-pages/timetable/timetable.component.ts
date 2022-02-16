import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

import { StudentService } from '../../shared/student.service';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})

export class TimetableComponent implements OnInit {
  studentId: string ="";
  baseUrl = 'http://localhost:3000/printTimetable';
  html :any;

  constructor(private http : HttpClient,private router: Router, private route:ActivatedRoute,private studentService: StudentService) { }

  ngOnInit(): void {
    let id = (this.route.snapshot.paramMap.get('id')) as string;
    this.studentId= id;

    this.studentService.getSelectedStudent(this.studentId)
    .subscribe(data => {this.studentService.selectedStudent = data; 
    //console.log(this.studentService.selectedStudent);
    this.http.get(this.baseUrl+`/${this.studentService.selectedStudent.USER_ID}` , { responseType: "text" })
    .subscribe((res) => {
      this.html = res; 
      console.log(res);
      
    }); 
  
  
  } );

  
   
  }

  goBack(){
    this.router.navigate(['home', this.studentId]);   
  }

  
}
