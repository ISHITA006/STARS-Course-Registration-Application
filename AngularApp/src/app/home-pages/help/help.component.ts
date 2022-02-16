import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';

import { ModuleService } from 'src/app/shared/module.service';
import { StudentService } from '../../shared/student.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent implements OnInit {

  studentId: string = "";
  curentStudent:any;
  allModules: any =[];
  registered: any =[];

  constructor(private http : HttpClient, private route: ActivatedRoute,
     private router:Router, private studentService: StudentService, private moduleService: ModuleService) { }

  ngOnInit(): void {
    ///////////////////get selectedStudent////////////////////////
    let id = (this.route.snapshot.paramMap.get('id')) as string;
    this.studentId= id;

    this.studentService.getSelectedStudent(this.studentId)
    .subscribe(data => {this.studentService.selectedStudent = data; 
    console.log(this.studentService.selectedStudent);
    this.curentStudent = this.studentService.selectedStudent;
    this.moduleService.getAllModules()
    .subscribe(data => {
    this.moduleService.modules = data ;
    this.allModules = this.moduleService.modules;
    this.getRegisteredModules(this.curentStudent);
    });
    
  });
    ///////////////////////////////////////////////////////////////

  }

  getRegisteredModules(student: any){
    if(student.REGISTERED_COURSES!==(null || undefined)){
    let courseArray = Object.entries(student.REGISTERED_COURSES);
    console.log(courseArray);
    console.log(this.allModules);
    let i;
    for(i=0; i<courseArray.length; i++){
      for(let mod of this.allModules){
        if(courseArray[i][0]===mod.COURSE){
          let temp = [];
          temp.push(courseArray[i][0]);
          temp.push(mod.NAME);
          temp.push(courseArray[i][1]);
          this.registered.push(temp);
        }
      }
    }
    console.log(this.registered);
  }
  }
}
