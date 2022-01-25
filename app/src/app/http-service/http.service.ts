import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  headerConfig: any = new Headers();
  
  endpoint = 'localhost:3000/';

  constructor(private http: HttpClient) { }

  upload(file: any, type: String): any {
    console.log(file)
    this.http.post<any>(this.endpoint, file, this.headerConfig)
      .subscribe(data => {
        console.log(data)
      })
    
  }
}
