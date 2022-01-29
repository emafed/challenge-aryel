import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  headerConfig: any = new Headers();

  endpoint = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  upload(file: any): any {
    return this.http.post<any>(this.endpoint + "/uploadFile", file, {
      reportProgress: true,
      observe: 'events',
      headers: this.headerConfig
    })
  }

  getFiles() {
    return this.http.get<any>(this.endpoint + "/getFiles", this.headerConfig)
  }

  downloadFile(_id: String): Observable<any> {
    return this.http.get(this.endpoint + "/downloadFile/" + _id, {
      headers: this.headerConfig,
      responseType: 'blob',
      observe: "response"
    })


  }

  deleteFile(_id: String) {
    return this.http.delete<any>(this.endpoint + "/deleteFile/" + _id, this.headerConfig)
  }

}
