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

  upload(file: any, parentId?: string): any {
    return this.http.post<any>(this.endpoint + "/uploadFile/" + parentId, file, {
      reportProgress: true,
      observe: 'events',
      headers: this.headerConfig
    })
  }

  createFolder(folderName: string, parentId?: string) {
    let req = "/createFolder/" + folderName + "/" + parentId;
    return this.http.get<any>(this.endpoint + req, this.headerConfig);
  }

  getFiles(id: string) {
    return this.http.get<any>(this.endpoint + "/getFiles/" + id, this.headerConfig)
  }

  downloadFile(_id: String): Observable<any> {
    return this.http.get(this.endpoint + "/downloadFile/" + _id, {
      headers: this.headerConfig,
      responseType: 'blob',
      observe: "response"
    })
  }

  rename(_id: string, newFileName: string) {
    return this.http.put<any>(this.endpoint + "/rename/" + _id, { fileName: newFileName })
  }

  deleteFile(_id: String) {
    return this.http.delete<any>(this.endpoint + "/deleteFile/" + _id, this.headerConfig)
  }

}
