import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { ModuleService } from '../shared/module.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

 studentId: string ='';

  constructor(private router: Router, private route: ActivatedRoute, private moduleService: ModuleService) { }

  ngOnInit(): void {
    //console.log("in home page");
    let id = (this.route.snapshot.paramMap.get('id')) as string;
    this.studentId= id;
    //console.log(this.studentId);

    //////////////////////////////////////
    this.moduleService.getAllModules()
    .subscribe(data => this.moduleService.modules = data);
    //console.log(this.moduleService.modules);

  }

  routeToPlan(){
    console.log("working");
    console.log(this.studentId);
    this.router.navigate(['home/plan', this.studentId]);   
  }

  routeToAddDrop(){
    this.router.navigate(['home/addDrop', this.studentId]);   
  }

  routeToChangeIndex(){
    this.router.navigate(['home/change', this.studentId]);   
  }

  routeToCourseInfo(){
    this.router.navigate(['home/courseInfo', this.studentId]);   
  }

  routeToTimetable(){
    this.router.navigate(['home/timetable', this.studentId]);   
  }

  routeToHelp(){
    this.router.navigate(['home/help', this.studentId]);   
  }

  updateModuleInfo(){
    this.moduleService.updateModule().subscribe((res) =>{
      console.log("module info updated successfully");
    });
  }

  initMods(){



    for (let mod of this.moduleService.modules){
      this.moduleService.selectedModule = mod;
      let max =0;
      for(let index of this.moduleService.selectedModule.INDEX_LIST){
        max += index.MAX;
      }
      this.moduleService.selectedModule.MAX = max;
      this.moduleService.selectedModule.REGISTERED = 0;
      this.moduleService.selectedModule.VACANCIES = max;
      this.updateModuleInfo();
    }

  }
  
}
