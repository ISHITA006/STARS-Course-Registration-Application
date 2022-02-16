import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StudentService } from '../../shared/student.service';
import { ModuleService } from '../../shared/module.service';
import { IndexSwapService } from '../../shared/index-swap.service';

@Component({
  selector: 'app-change-index',
  templateUrl: './change-index.component.html',
  styleUrls: ['./change-index.component.css']
})
export class ChangeIndexComponent implements OnInit {

  studentId: string = "";
  registeredCoursesArray : any;
  getDetail: boolean = false;
  selectedCourse: string= "";
  currentIndex: any;
  desiredIndexList: number[]= [];
  desiredIndex: number= 0;
  error: string ="";
  overwrite: boolean = false;

  constructor(private route: ActivatedRoute, private studentService: StudentService, private moduleService: ModuleService, private indexSwapService: IndexSwapService) { }

  ngOnInit(): void {

    ///////////////////get selectedStudent////////////////////////
    let id = (this.route.snapshot.paramMap.get('id')) as string;
    this.studentId= id;

    this.studentService.getSelectedStudent(this.studentId)
    .subscribe(data => {this.studentService.selectedStudent = data; 
    console.log(this.studentService.selectedStudent);
    this.registeredCoursesArray = Object.entries(this.studentService.selectedStudent.REGISTERED_COURSES);
  });
    ///////////////////////////////////////////////////////////////

    /////////////////get all courses info//////////////////////////
    this.moduleService.getAllModules()
    .subscribe(data => this.moduleService.modules = data );
    //console.log(this.moduleService.modules);
    //////////////////////////////////////////////////////////////

    /////////////get all indexSwap Documents//////////////////////
    this.indexSwapService.getAllDocuments()
    .subscribe(data => {this.indexSwapService.allDocuments = data; 
    console.log(this.indexSwapService.allDocuments);} );
    ///////////////////////////////////////////////////////////////

  }

  getCourseIndexDetails(course: any){
    this.desiredIndexList=[];
  this.error ="";
  this.getDetail = true;
  console.log(course[0]);
  this.selectedCourse = course[0];
  this.currentIndex = course[1];
  for(let mod of this.moduleService.modules){
    if(mod.COURSE === course[0]){
      for(let element of mod.INDEX_LIST){
        let index = <number>element.INDEX;
        this.desiredIndexList.push(index);
      }
      break;
    }
  }
  //console.log(this.desiredIndexList);



  }

  changeIndex(){
    this.error="";
    console.log(this.selectedCourse);
    this.currentIndex = Number(this.currentIndex);
    this.desiredIndex = Number(this.desiredIndex);
    console.log(this.currentIndex);
    console.log(this.desiredIndex);
    let waitlist = false;
    let tempArr;
    let Error = false;

   // console.log(this.indexSwapService.allDocuments);

   //identify document to make updates to
    for(let doc of this.indexSwapService.allDocuments){
      if(doc.COURSE === this.selectedCourse ){
        this.indexSwapService.selectedDocument = doc;
        break;
        //console.log(doc);
      }
    }


        // student will be pushed to current or queue only if insuffiecient vacancies 
        //check if we need to push student to current
          let currentArray = Object.entries(this.indexSwapService.selectedDocument.current);
          //console.log(currentArray);
          let i,j;
          for(i=0; i<currentArray.length; i++){
            if(currentArray[i][0]===this.currentIndex.toString()){
              tempArr = <any>currentArray[i][1];
              break;}
            }          
  
              for(j=0; j<tempArr.length; j++ ){
                if(tempArr[j]===this.studentService.selectedStudent.USER_ID){
                  this.error = "You have already requested to swap indexes for chosen course";
                  Error= true;
                  //this.checkOverwriteChange();
                  return;
                }
                else{continue;}
              }


              //check if we have vacancies for desired index or not
      for(let mod of this.moduleService.modules){
        if(mod.COURSE===this.selectedCourse){
          for(let index of mod.INDEX_LIST){
            if(index.INDEX===this.desiredIndex){
              //check vacancy avail
              if(index.VACANCIES=== 0) waitlist= true;
              else waitlist = false;
              break;
            }
          }
          break;
        }
      }

      if(!waitlist && (Error ===false)){
        //change indexes straightaway => drop current selectedCourse, index, add selectedCourse desired index
        this.dropCourse(this.selectedCourse, this.currentIndex);
        this.addCourse(this.selectedCourse, this.desiredIndex);
        alert("Index for "+this.selectedCourse+" changed to "+this.desiredIndex+".");
        this.currentIndex = this.desiredIndex;
        this.registeredCoursesArray = Object.entries(this.studentService.selectedStudent.REGISTERED_COURSES);
        return;
      }

            //console.log(Error);
            if(waitlist && (Error===false)){
            tempArr.push(this.studentService.selectedStudent.USER_ID);
            currentArray[i][1]=tempArr;
            this.indexSwapService.selectedDocument.current= (<any>Object).fromEntries(currentArray);

            let queueArray: any = Object.entries(this.indexSwapService.selectedDocument.queue);
            console.log(queueArray);
            let desiredIndexString = this.desiredIndex.toString();
            //let userIdString = this.studentService.selectedStudent.USER_ID;
            let newEntry = [];
            //let newEntry= {`$(this.studentService.selectedStudent.USER_ID)` : desiredIndexString};
             newEntry[0] = <string>this.studentService.selectedStudent.USER_ID;
             newEntry[1]= <unknown>desiredIndexString;
            // let x = Object.entries(newEntry);
            // let newEntryArray = x[0];
            queueArray.push(newEntry);
            this.indexSwapService.selectedDocument.queue= (<any>Object).fromEntries(queueArray);

            this.updateIndexSwapInfo();
            alert("You have successfully been put on waitlist for the chosen course and index.");

            }  

            
          }   
          

    checkOverwriteChange(){
      console.log(this.overwrite);
      if(this.overwrite===false){ this.error=""; return;}
      else{

        let waitlist = false;

        //check if vacancies are there
      for(let mod of this.moduleService.modules){
        if(mod.COURSE===this.selectedCourse){
          for(let index of mod.INDEX_LIST){
            if(index.INDEX===this.desiredIndex){
              //check vacancy avail
              if(index.VACANCIES=== 0) waitlist= true;
              else waitlist = false;
              break;
            }
          }
          break;
        }
      }

      //if vacancy is there, delete prev index swap req then change to new index
      if(!waitlist){
        let currentArray: any = Object.entries(this.indexSwapService.selectedDocument.current);
        let i,j;
        let tempStudentArr;
        for(i=0; i<currentArray.length; i++){
          if(currentArray[i][0]===this.currentIndex.toString()){
            tempStudentArr = currentArray[i][1];
            for(j=0; j<tempStudentArr.length; j++){
              if(tempStudentArr[j]===this.studentService.selectedStudent.USER_ID){
                tempStudentArr.splice(j,1);
                //currentArray[i][1]= tempStudentArr;
                break;
              }
            }
            break;
          }
        }
        currentArray[i][1]= tempStudentArr;
        this.indexSwapService.selectedDocument.current = (<any>Object).fromEntries(currentArray);

        let queueArray: any = Object.entries(this.indexSwapService.selectedDocument.queue);
        let k;
        for(k=0; k<queueArray.length; k++){
          if(queueArray[k][0]===this.studentService.selectedStudent.USER_ID){
            queueArray.splice(k, 1);
            break;
          }
        }
        this.indexSwapService.selectedDocument.queue = (<any>Object).fromEntries(queueArray);

        this.updateIndexSwapInfo();

        this.dropCourse(this.selectedCourse, this.currentIndex);
        this.addCourse(this.selectedCourse, this.desiredIndex);
        alert("Index for "+this.selectedCourse+" successfully changed to "+this.desiredIndex+".");
        this.error="";
        this.currentIndex = this.desiredIndex;
        this.registeredCoursesArray = Object.entries(this.studentService.selectedStudent.REGISTERED_COURSES);
        return;
      }


        //if no vacancy for chosen course and index,
        //find student desired index combi in queue, delete it then add new student desired index combi to queue

        //find student desired index combi and delete it
        if(waitlist){
        let queueArray: any = Object.entries(this.indexSwapService.selectedDocument.queue);
        let i;

        for(i=0;  i<queueArray.length; i++){
          if(queueArray[i][0]===this.studentService.selectedStudent.USER_ID){
            queueArray.splice(i,1);
            break;
          }
        }
        //add new student desired index combi to queue
        let desiredIndexString = this.desiredIndex.toString();
        let newEntry = [];
             newEntry[0] = <string>this.studentService.selectedStudent.USER_ID;
             newEntry[1]= <unknown>desiredIndexString;
            queueArray.push(newEntry);

        this.indexSwapService.selectedDocument.queue = (<any>Object).fromEntries(queueArray);

        this.updateIndexSwapInfo();
        alert("Index swap request for "+this.selectedCourse+" updated to "+ this.desiredIndex+"!");
        this.error="";
      }
      }

  }

  dropCourse(course: string, index: number){ //module: obtained from html
    //let course = Object.keys(dropmodule)[0];
    //let index = Object.values(dropmodule)[0];
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
            break;
          }
        }
        this.updateModuleInfo();
        break;

      }
    }

    this.updateIndexSwapOnDrop(course, index);
    //alert("Course "+ course+ " deregistered successfully!");

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


  addCourse(course: string, index: number){ //module: obtained from html
    
    let registeredCoursesArray: any = Object.entries(this.studentService.selectedStudent.REGISTERED_COURSES);
    let tempArr=[course, index];
    registeredCoursesArray.push(tempArr);
    this.studentService.selectedStudent.REGISTERED_COURSES= (<any>Object).fromEntries(registeredCoursesArray);
    this.studentService.selectedStudent.TOTAL_AU += 3;
       
    //console.log(this.studentService.selectedStudent.REGISTERED_COURSES);

    this.updateStudentInfo();

    for(let mod of this.moduleService.modules){
      if(mod.COURSE===course){
        this.moduleService.selectedModule= mod;
        this.moduleService.selectedModule.REGISTERED += 1;
        this.moduleService.selectedModule.VACANCIES -= 1;
        let i;
        for(i=0; i<this.moduleService.selectedModule.INDEX_LIST.length; i++){
          if(this.moduleService.selectedModule.INDEX_LIST[i].INDEX===index){
            this.moduleService.selectedModule.INDEX_LIST[i].REGISTERED += 1;
            this.moduleService.selectedModule.INDEX_LIST[i].VACANCIES -= 1;
          }
        }
        this.updateModuleInfo();
      }
    }

    this.updateIndexSwapOnAdd(course, index);
    //alert("Course "+ course+ " deregistered successfully!");

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
    console.log(registeredArray);

    let indexString = String(index);
    console.log(indexString);

    for(i=0; i<registeredArray.length; i++){
      if(registeredArray[i][0]=== <unknown>indexString){
        let tempArr = <any>registeredArray[i][1];
        tempArr.push(this.studentService.selectedStudent.USER_ID);
        registeredArray[i][1] = tempArr;
        break;
      }
    }

    this.indexSwapService.selectedDocument.registered = (<any>Object).fromEntries(registeredArray);
    console.log(this.indexSwapService.selectedDocument.registered);

    this.updateIndexSwapInfo();
    

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

  updateModuleInfo(){
    this.moduleService.updateModule().subscribe((res) =>{
      console.log("module info updated successfully");
    });
  }










}
