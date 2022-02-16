import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ModuleService } from '../../shared/module.service';
import { StudentService } from '../../shared/student.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  parentSelector: boolean = false;
  modules: any = [];
  input: any = [];
  nextDisable : boolean = false;
  prevDisable : boolean = false;


  initializeInput(){
    console.log("entering");
    console.log(this.moduleService.modules);
    for(var i = 0 ; i < this.moduleService.modules.length ;i++){
      let entry: any = {};
      entry._id = this.moduleService.modules[i]._id;
      entry.COURSE = this.moduleService.modules[i].COURSE;
      entry.NAME = this.moduleService.modules[i].NAME;
      entry.AU = this.moduleService.modules[i].AU;
      entry.select = false;
      this.modules.push(entry);
    }

  }
  

  onChangeMOD($event:any) {
  
    const id = $event.target.value;
    const isChecked = $event.target.checked;

    this.modules = this.modules.map((d: any) => {
      if (d._id == id) {
        d.select = isChecked;
        this.parentSelector = false;
        return d;
      }
      if (id == -1) {
        d.select = this.parentSelector;
        return d;
      }
      return d;
    });

    //accessing just the course codes
    
    this.input = this.modules.map((d: any) => {
      if(d.select==true){
        console.log(d['COURSE']);
        return d['COURSE'];
      }
      
      return '';
    })
    

    //removing empty strings
    let brr = [''];
    this.input = this.input.filter((f:any) => !brr.includes(f));

    console.log(this.input);
  }


///////////////////////////////////////////////////////////////////////////  

studentId: string ="";
//input = ["CE2002", "CE2005", "CE2006", "CE2100", "CE2101", "CE2107"]; // to be obtained from html
getCombinationsUrl =  'http://localhost:3000/generateCombinations';
getTimetablesUrl = 'http://localhost:3000/generateTimetable';
inputString: string = "";
combinations: any;
TTgenerator: boolean = false;
html :any;
currentHtml: any;
currentPlan: any;
savedPlanNumber: number = 0;
planNumber: number =0;
savePlan: number =0;

  constructor(private http : HttpClient,private route: ActivatedRoute, private studentService: StudentService, private moduleService: ModuleService) { }

  ngOnInit(): void {

    let id = (this.route.snapshot.paramMap.get('id')) as string;
    this.studentId= id;

    this.studentService.getSelectedStudent(this.studentId)
    .subscribe(data => {this.studentService.selectedStudent = data; 
    console.log(this.studentService.selectedStudent);} );

    this.moduleService.getAllModules()
    .subscribe(data => {
      this.moduleService.modules = data;
      console.log(this.moduleService.modules);
      this.initializeInput();
    });
  
  } 

  generateTimetables(){
    this.TTgenerator = true;
    this.generateInputString(this.input);
    this.getCombinations(this.inputString);
    this.getTimetables(this.inputString);   

  }

  showPlans(){
    this.displayFirstTimetable();
  }


displayFirstTimetable(){
  this.prevDisable= true;
    this.currentHtml = this.html[0];
    //console.log(this.currentHtml);
    this.currentPlan = this.combinations[0];
    console.log(this.currentPlan);
}

loadPrevCombination(){
  this.planNumber--;
  if(this.planNumber<=0){this.prevDisable= true;} else this.prevDisable=false;
  if(this.planNumber>=4){this.nextDisable = true;} else this.nextDisable=false;
  this.currentHtml = this.html[this.planNumber];
  this.currentPlan = this.combinations[this.planNumber];
  console.log(this.currentPlan);
}

loadNextCombination(){
  this.planNumber++;
  if(this.planNumber<=0){this.prevDisable= true;} else this.prevDisable=false;
  if(this.planNumber>=4){this.nextDisable = true;} else this.nextDisable=false;
  this.currentHtml = this.html[this.planNumber];
  this.currentPlan = this.combinations[this.planNumber];
  console.log(this.currentPlan);
}

saveCurrentPlan(){
  console.log(this.savePlan);
  this.studentService.selectedStudent.SAVED_PLANS[this.savePlan - 1]= this.currentPlan;
  this.updateStudentInfo();
  alert("Current timetable saved as Plan "+ this.savePlan);
}

updateStudentInfo(){
  console.log(this.studentService.selectedStudent);
  this.studentService.updateStudent().subscribe((res) =>{
    console.log("student info updated successfully");
  });
}

generateInputString(input: string[]){
  let i;
  for(i=0; i<input.length; i++){
    if(i!==input.length-1){
    let concat = input[i]+",";
    this.inputString += concat ;
    }
    else{
      let concat = input[i];
      this.inputString += concat; 
    }
  }
  //console.log(this.inputString);
}

getCombinations(inputString: string){
  this.http.get(this.getCombinationsUrl+`/${inputString}`)
  .subscribe((res) => {
    this.combinations = res; 
    console.log(res); 
  }); 
  }


getTimetables(inputString: string){
  this.http.get(this.getTimetablesUrl+`/${inputString}` )
  .subscribe((res) => {
    this.html = res; 
    console.log(res); 
  }); 
  }
}