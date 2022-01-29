import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as saveAs from 'file-saver';

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

  downloadFile(_id: String) {
    return this.http.get(this.endpoint + "/downloadFile/" + _id, {
      headers: this.headerConfig,
      responseType: 'blob',
      observe: 'response'
    }).subscribe((response: any) => {
      console.log(response.headers.get('Content-Disposition') )
			let blob:any = new Blob([response]);
			const url = window.URL.createObjectURL(blob);
			//window.open(url);
			saveAs(blob, 'employees.json');
			})
     
  

  }

  deleteFile(_id: String) {
    return this.http.delete<any>(this.endpoint + "/deleteFile/" + _id, this.headerConfig)
  }

}
