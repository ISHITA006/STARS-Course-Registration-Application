import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Module } from './module.model';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  selectedModule: Module = new Module;
  modules: Module[] = [];
  readonly baseURL = 'http://localhost:3000/courseInfo';

  constructor(private http : HttpClient) { }

  getAllModules(): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseURL);   
  }

  updateModule(){
    return this.http.put(this.baseURL + `/${this.selectedModule._id}`, this.selectedModule);
  }

}
