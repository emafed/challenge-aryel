import { Component, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialog } from './newfolder-dialog/newfolder-dialog';
import { HttpService } from './http-service/http.service';
import { ViewChild } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Files {
  type: String,
  level: Number,
  parentId: String,
  fileName: String,
  originalFileName: String,
  size: Number,
  extension: String,
  mime: String,
  loadDate: Date
  modDate: Date
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  constructor(private dialog: MatDialog, private httpService: HttpService, private _snackBar: MatSnackBar) { }
  title = 'challenge-aryel';
  displayedColumns: string[] = ['level', 'fileName', 'opt'];
  dataSource: any;
  progress: any = undefined;
  clickedRows = new Set<Files>();

  @ViewChild('fileInput')
  fileInputVar: ElementRef | undefined;


  ngOnInit() {
    this.getFiles()
  }

  openDialog() {
    this.dialog.open(NewFolderDialog);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "OK");
  }

  getFiles() {
    this.httpService.getFiles().subscribe(files => {
      this.dataSource = files
    });
  }

  deleteFile(_id: String) {
    this.httpService.deleteFile(_id).subscribe({
      complete: () => { 
        this.getFiles()
        this.openSnackBar("File eliminato")
      },
      error: console.error
    });
  }

  downloadFile(_id: String){
    this.httpService.downloadFile(_id)
  }

  onFileSelected(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.httpService.upload(formData).subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total! * 100);
            break;
          case HttpEventType.Response:
            console.log(event.body);
            setTimeout(() => {
              this.progress = undefined;
              this.getFiles();
              this.openSnackBar("Caricamento completato")
            }, 1500);

        }
      })
    }
    this.fileInputVar!.nativeElement.value = "";
  }

}
