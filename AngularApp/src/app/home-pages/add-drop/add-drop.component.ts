import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StudentService } from '../../shared/student.service';
import { ModuleService } from '../../shared/module.service';
import { IndexSwapService } from '../../shared/index-swap.service';


@Component({
  selector: 'app-add-drop',
  templateUrl: './add-drop.component.html',
  styleUrls: ['./add-drop.component.css']
})

export class AddDropComponent implements OnInit {

  studentId: string ="";
  //obtain this from html component
  newCourses: any ;
  dropModule:any;
  //
  add: boolean = true;
  loadPlan: number =0;
  error: string = "";
  //
  public newAttribute : any = [];
  public registeredCoursesArray : Array<any>=[]; //needed for drop courses
  public addCoursesArray : Array<any> = [];
  public dropCoursesArray : Array<any> = [];

  constructor(private route: ActivatedRoute, private studentService: StudentService, private moduleService: ModuleService, private indexSwapService: IndexSwapService) { }

  ngOnInit(): void { 

    ///////////////////get selectedStudent////////////////////////
    let id = (this.route.snapshot.paramMap.get('id')) as string;
    this.studentId= id;

    this.studentService.getSelectedStudent(this.studentId)
    .subscribe(data => {this.studentService.selectedStudent = data;
      if(this.studentService.selectedStudent.REGISTERED_COURSES!==(null||undefined)){
      this.registeredCoursesArray = Object.entries(this.studentService.selectedStudent.REGISTERED_COURSES);
      console.log(this.registeredCoursesArray); }
    console.log(this.studentService.selectedStudent);} );
    ///////////////////////////////////////////////////////////////

    /////////////////get all courses info//////////////////////////
    this.moduleService.getAllModules()
    .subscribe(data => this.moduleService.modules = data );
    //console.log(this.moduleService.modules);
    //////////////////////////////////////////////////////////////

    /////////////get all indexSwap Documents//////////////////////
    this.indexSwapService.getAllDocuments()
    .subscribe(data => {this.indexSwapService.allDocuments = data; } );
    ///////////////////////////////////////////////////////////////

 }

 addArrayValue() {
  if (this.newAttribute[0] == null || this.newAttribute[1] == null) {
    alert("One or more required fields are missing. Please check.");
  } else {
    this.newAttribute[1]= Number(this.newAttribute[1]);
    this.addCoursesArray.push(this.newAttribute);
    this.newAttribute = [];
  }
}
deleteArrayValue(index : number) {
  this.addCoursesArray.splice(index, 1);
}

toDrop(event : any, index : number) {
  let toDrop = this.registeredCoursesArray[index];
  if (event.target.checked) {
    
    this.dropCoursesArray.push(toDrop);
  } else {
    const idx = this.dropCoursesArray.indexOf(toDrop);
    this.dropCoursesArray.splice(idx, 1);
  }

}

testAdd() {
  if (!this.addCoursesArray.length) {
    alert('You did not add any module!');
  } else {
    console.log(this.addCoursesArray);
    this.newCourses= (<any>Object).fromEntries(this.addCoursesArray);
    console.log(this.newCourses);
    this.onAdd();
    this.registeredCoursesArray = Object.entries(this.studentService.selectedStudent.REGISTERED_COURSES);
  }
}
testDrop() {
  if (!this.dropCoursesArray.length) {
    alert('You did not choose any module to drop!'); return;}

  console.log(this.dropCoursesArray);

    for(let mod of this.dropCoursesArray){
      let temp= [];
      temp.push(mod);
      let dropCourse = (<any>Object).fromEntries(temp);
      console.log(dropCourse);
      this.onDrop(dropCourse);
    }

    this.registeredCoursesArray = Object.entries(this.studentService.selectedStudent.REGISTERED_COURSES);
    this.dropCoursesArray = [];
    //alert("") 
  
}

 /////////////////////////////////////////////////////////////////////////////////////

 loadChosenPlan(){
  this.error = "";
  this.addCoursesArray =[];
  let savedPlan = this.studentService.selectedStudent.SAVED_PLANS[this.loadPlan-1];
   
   if(savedPlan===(null||undefined)){
     this.error = "No timetable saved as Plan "+this.loadPlan;
     alert("No timetable saved as Plan "+this.loadPlan);
     console.log(this.error);
   } 
  else{ this.addCoursesArray = Object.entries(savedPlan);}

 }

  onAdd(){
    //newCourseArray & registeredCoursesArray are array of arrays where each element is an array of 2 elements (first being key (course), second beng value (index))
    let newCoursesArray = Object.entries(this.newCourses);
    let registeredCoursesArray: any = [];
    if(this.studentService.selectedStudent.REGISTERED_COURSES !== (null || undefined)){
    registeredCoursesArray = Object.entries(this.studentService.selectedStudent.REGISTERED_COURSES);}
    let atLeastOne = false;
    let i,j = 0;
    for (i=0; i<newCoursesArray.length; i++){
      
      //check if we need to add that course to student document or it is already registered
      this.add = true;
      if(registeredCoursesArray.length !== 0){
      for(j=0; j<registeredCoursesArray.length; j++){
        if (newCoursesArray[i][0] === registeredCoursesArray[j][0]){
          this.add = false;
          alert("Course "+newCoursesArray[i][0]+" is already registered!");
          break;
        }
      }
    }

      //check if there are sufficient vacancies of that course/index then set canAdd value
      let canAdd = true;
      if(this.add){
        for (let mod of this.moduleService.modules){
          if(mod.COURSE === newCoursesArray[i][0] ){
            if(mod.VACANCIES === 0){
              alert("There are no more vacancies for course "+ newCoursesArray[i][0]);
              canAdd= false;
              break;
            }
            else{

              for(let element of mod.INDEX_LIST){
                if(element.INDEX===newCoursesArray[i][1]){
                  if(element.VACANCIES===0){
                    alert("There are no more vacancies for the chosen index for course "+ newCoursesArray[i][0]+". Try choosing another index.");
                    canAdd=false;
                    break;
                  }
                  else{canAdd= true;}
                }
              }

            }
            break;
          }
        }


      }

      //if we need to add that course
      if(this.add && canAdd){
         atLeastOne = true;
         this.studentService.selectedStudent.TOTAL_AU += 3;
         registeredCoursesArray.push(newCoursesArray[i]);
         this.addCoursesArray.splice(i,1);
         this.updateModule(newCoursesArray[i][0], <number>newCoursesArray[i][1]); 
         this.updateIndexSwapOnAdd(newCoursesArray[i][0], <number>newCoursesArray[i][1]);
        }
   
    }

    this.studentService.selectedStudent.REGISTERED_COURSES = (<any>Object).fromEntries(registeredCoursesArray);
    //console.log(this.studentService.selectedStudent.REGISTERED_COURSES);
   
    this.updateStudentInfo();
    if(atLeastOne){alert("Course(s) registered successfully!");}
    
  }

  onDrop(dropmodule : any){ //module: obtained from html
    let course = Object.keys(dropmodule)[0];
    let index = Object.values(dropmodule)[0];
    let i =0;
    let registeredCoursesArray = Object.entries(this.studentService.selectedStudent.REGISTERED_COURSES);
    for (i=0; i<registeredCoursesArray.length; i++){
      if(registeredCoursesArray[i][0]=== course){
        registeredCoursesArray.splice(i, 1);
        this.studentService.selectedStudent.TOTAL_AU -= 3;
        break;
      }
      else continue;
    }

    this.studentService.selectedStudent.REGISTERED_COURSES = (<any>Object).fromEntries(registeredCoursesArray);
    //console.log(this.studentService.selectedStudent.REGISTERED_COURSES);

    this.updateStudentInfo();

    for(let mod of this.moduleService.modules){
      if(mod.COURSE===course){
        this.moduleService.selectedModule= mod;
        this.moduleService.selectedModule.REGISTERED -= 1;
        this.moduleService.selectedModule.VACANCIES += 1;
        let i;
        for(i=0; i<this.moduleService.selectedModule.INDEX_LIST.length; i++){
          if(this.moduleService.selectedModule.INDEX_LIST[i].INDEX===index){
            this.moduleService.selectedModule.INDEX_LIST[i].REGISTERED -= 1;
            this.moduleService.selectedModule.INDEX_LIST[i].VACANCIES += 1;
          }
        }
        this.updateModuleInfo();
      }
    }

    this.updateIndexSwapOnDrop(course, <number>index);
    alert("Course "+ course+ " deregistered successfully!");

  }

  updateModule(course: string, index: number){
        for (let mod of this.moduleService.modules){
        if (mod.COURSE === course){
          this.moduleService.selectedModule= mod;
          this.moduleService.selectedModule.REGISTERED +=  1;
          this.moduleService.selectedModule.VACANCIES -=  1;
          let i;
          for(i=0; i<this.moduleService.selectedModule.INDEX_LIST.length; i++){
            if (this.moduleService.selectedModule.INDEX_LIST[i].INDEX===index){
              this.moduleService.selectedModule.INDEX_LIST[i].REGISTERED += 1;
              this.moduleService.selectedModule.INDEX_LIST[i].VACANCIES -= 1;
              break;
            }
          }
          this.updateModuleInfo();
          break;
        }
        else { continue ;}
      } 
  }

  updateIndexSwapOnAdd(course: string, index: number){
    let i;

    //identify course to be modified
    for(let document of this.indexSwapService.allDocuments){
      if(document.COURSE === course ){
        this.indexSwapService.selectedDocument = document;
        break;
      }
    }

    //identify index to be modified
    let registeredArray = Object.entries(this.indexSwapService.selectedDocument.registered);
    //let indexArray = Object.keys(registeredArray);
    //let studentsArray = Object.values(registeredArray);
    console.log(registeredArray);

    let indexString = String(index);
    console.log(indexString);

    for(i=0; i<registeredArray.length; i++){
      if(registeredArray[i][0]=== <unknown>indexString){
        let tempArr = <any>registeredArray[i][1];
        tempArr.push(this.studentService.selectedStudent.USER_ID);
        registeredArray[i][1] = tempArr;
        // console.log(tempArr);
        // console.log(registeredArray[i][1]);
        break;
      }
    }

    this.indexSwapService.selectedDocument.registered = (<any>Object).fromEntries(registeredArray);
    console.log(this.indexSwapService.selectedDocument.registered);

    this.updateIndexSwapInfo();
    

  }

  updateIndexSwapOnDrop(course: string, index: number){
    let i,j;

    //identify course to be modified
    for(let document of this.indexSwapService.allDocuments){
      if(document.COURSE === course ){
        this.indexSwapService.selectedDocument = document;
        break;
      }
    }

    //identify index to be modified
    let registeredArray = Object.entries(this.indexSwapService.selectedDocument.registered);
    //let indexArray = Object.keys(registeredArray);
    //let studentsArray = Object.values(registeredArray);
    console.log(registeredArray);

    let indexString = String(index);
    console.log(indexString);

    for(i=0; i<registeredArray.length; i++){
      if(registeredArray[i][0]=== <unknown>indexString){
        let tempArr = <any>registeredArray[i][1];
        for(j=0; j<tempArr.length; j++){
          if(tempArr[j]===this.studentService.selectedStudent.USER_ID){
            tempArr.splice(j,1);
            console.log(tempArr);
            break;
          }
        }
        registeredArray[i][1] = tempArr;
        console.log(registeredArray[i][1]);
        break;
      }
    }

    this.indexSwapService.selectedDocument.registered = (<any>Object).fromEntries(registeredArray);
    console.log(this.indexSwapService.selectedDocument.registered);

    this.updateIndexSwapInfo();
    

  }

  updateModuleInfo(){
    this.moduleService.updateModule().subscribe((res) =>{
      console.log("module info updated successfully");
    });
  }

  updateIndexSwapInfo(){
    this.indexSwapService.updateDocument().subscribe((res)=>{
      console.log("indexSwap info updated successfully");
    });
  }
  

  updateStudentInfo(){
    console.log(this.studentService.selectedStudent);
    this.studentService.updateStudent().subscribe((res) =>{
      console.log("student info updated successfully");
    });
  }

}
