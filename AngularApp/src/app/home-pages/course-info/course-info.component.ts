import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';

import { ModuleService } from 'src/app/shared/module.service';
import { StudentService } from '../../shared/student.service';


@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.css']
})
export class CourseInfoComponent implements OnInit {

  studentId: string = "";
  allModules: any = [];
  filteredModules: any = [];
  filterValue: string = "";
  showCourseInfo: boolean = false;
  chosenModule: any;
  chosenModTotalIndexes: number =0;

  constructor(private http : HttpClient, private route: ActivatedRoute,
    private moduleService: ModuleService, private router:Router, private studentService: StudentService) { }

  ngOnInit(): void {

    ///////////////////get selectedStudent////////////////////////
    let id = (this.route.snapshot.paramMap.get('id')) as string;
    this.studentId= id;

    this.studentService.getSelectedStudent(this.studentId)
    .subscribe(data => {this.studentService.selectedStudent = data; 
    console.log(this.studentService.selectedStudent);
  });
    ///////////////////////////////////////////////////////////////

    this.moduleService.getAllModules()
    .subscribe(data => {
    this.moduleService.modules = data ;
    //console.log(this.moduleService.modules);
    this.allModules = this.moduleService.modules;
    this.filteredModules = this.moduleService.modules;});

  }


    filterModules(){
   
      this.filterValue = this.filterValue.toUpperCase();
      this.filteredModules = [];

      for (let mod of this.allModules){
        if(this.isSubstring(this.filterValue, mod.COURSE) || this.isSubstring(this.filterValue, mod.NAME) )
        this.filteredModules.push(mod);
      }
  
    }

    isSubstring(string: string, source: string): Boolean{
      if(source.indexOf(string) !== -1){return true;}
      else {return false;}
    }

    getCourseInfo(mod: any){
      //this.moduleService.selectedModule = mod;
      this.chosenModule= mod;
      console.log(this.chosenModule);
      this.chosenModTotalIndexes = mod.INDEX_LIST.length;
      this.showCourseInfo= true;
    }

}
