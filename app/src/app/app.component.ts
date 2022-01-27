import { Component, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewFolderDialog } from './newfolder-dialog/newfolder-dialog';
import { HttpService } from './http-service/http.service';
import { ViewChild } from '@angular/core';

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
  constructor(private dialog: MatDialog, private httpService: HttpService) { }
  title = 'challenge-aryel';
  displayedColumns: string[] = ['level', 'fileName'];
  dataSource: any;

  @ViewChild('fileInput')
  fileInputVar: ElementRef | undefined ;


  ngOnInit() {
    this.getFiles()
  }

  openDialog() {
    this.dialog.open(NewFolderDialog);
  }

  getFiles() {
    this.httpService.getFiles().subscribe(files => {
      this.dataSource = files
    });
  }

  onFileSelected(event: any) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('file', file, file.name);
      this.httpService.upload(formData, "FILE").subscribe((data: any) => {
        //console.log(data)
        this.getFiles()
      }, (error: any) => {
        console.log(error)
      })
    }
    this.fileInputVar!.nativeElement.value = "";
  }

}
