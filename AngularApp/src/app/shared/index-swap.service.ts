import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

import { IndexSwap } from './index-swap.model';


@Injectable({
  providedIn: 'root'
})
export class IndexSwapService {

  selectedDocument : IndexSwap ={
    _id: "",
    COURSE: "",
    current: {},
    registered : {},
    queue : {}
  };

  allDocuments: IndexSwap[]= [];
  readonly baseURL = 'http://localhost:3000/indexSwap';


  constructor(private http : HttpClient) { }

  getAllDocuments(): Observable<IndexSwap[]> {
    return this.http.get<IndexSwap[]>(this.baseURL);   
  }

  getSelectedDocument(id: String):  Observable<IndexSwap>{
    return this.http.get<IndexSwap>(this.baseURL+`/${id}`);
  }

  updateDocument(){
    return this.http.put(this.baseURL + `/${this.selectedDocument._id}`, this.selectedDocument);
  }


}
